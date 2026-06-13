// convex/http.ts

import { createClerkClient } from "@clerk/backend";
import { verifyWebhook } from "@clerk/backend/webhooks";
import { httpRouter } from "convex/server";

import { internal } from "./_generated/api";
import { httpAction } from "./_generated/server";

const http = httpRouter();

http.route({
  path: "/clerk",
  method: "POST",

  handler: httpAction(async (ctx, request) => {
    let event: Awaited<ReturnType<typeof verifyWebhook>>;

    try {
      event = await verifyWebhook(request);
    } catch (error) {
      console.error(error);

      return new Response("Invalid webhook", {
        status: 400,
      });
    }

    switch (event.type) {
      case "user.created":
      case "user.updated": {
        const user = event.data;

        const email = user.email_addresses.find(
          (email) => email.id === user.primary_email_address_id,
        )?.email_address;

        const name = [user.first_name, user.last_name].filter(Boolean).join(" ").trim();

        if (!email || !name) {
          return new Response("Missing email or name", {
            status: 400,
          });
        }

        const dbUserId = await ctx.runMutation(internal.users.upsertUser, {
          clerkId: user.id,
          email,
          name,
          avatar: user.image_url,
        });

        if (event.type === "user.created") {
          const client = createClerkClient({
            secretKey: process.env["CLERK_SECRET_KEY"]!,
          });

          await client.users.updateUserMetadata(user.id, {
            publicMetadata: {
              userId: dbUserId,
            },
          });
        }

        break;
      }

      case "user.deleted": {
        if (!event.data.id) {
          break;
        }

        await ctx.runMutation(internal.users.deleteUser, {
          clerkId: event.data.id,
        });

        break;
      }
    }

    return new Response(null, {
      status: 200,
    });
  }),
});

export default http;
