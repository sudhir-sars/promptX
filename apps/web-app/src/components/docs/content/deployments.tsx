import {
  Callout,
  CodeBlock,
  DocDivider,
  DocH3,
  DocList,
  DocPageWrapper,
  DocParagraph,
  DocSection,
  InlineCode,
  StepList,
} from "../doc-primitives";

export default function DeploymentsContent() {
  return (
    <DocPageWrapper>
      <div>
        <h1 className="text-[22px] font-semibold tracking-tight text-foreground/90 md:text-[26px]">
          Deployments
        </h1>
        <DocParagraph className="mt-4 max-w-lg">
          Ship prompt changes to production without touching your codebase. Gradual rollouts,
          traffic splits, canary releases, and instant rollback — all from the dashboard or API.
        </DocParagraph>
      </div>

      <DocDivider />

      <DocSection id="deployment-model" label="Concepts" title="The deployment model">
        <DocParagraph>
          A deployment determines which version is served when your application calls{" "}
          <InlineCode>promptx.get("checkout-assistant")</InlineCode>. You can deploy a single
          version, run an A/B test between multiple versions, or allocate traffic across several
          versions to control rollout behavior.
        </DocParagraph>
      </DocSection>
      <DocDivider />

      <DocSection id="traffic-splitting" label="Traffic" title="Traffic splitting">
        <DocParagraph>
          When deploying a new version while another version is already deployed, you can either
          replace the existing deployment or create an A/B test. A/B tests distribute traffic across
          multiple versions according to the traffic allocations configured during deployment.
        </DocParagraph>

        <DocH3 className="mt-5">Session-based allocation</DocH3>

        <DocParagraph className="mt-2">
          A/B testing requires a <InlineCode>sessionId</InlineCode>. The value can be any stable
          unique identifier that represents the current user or session, such as a chat ID,
          conversation ID, session ID, or user ID. PromptX uses this identifier to consistently
          assign requests to the same version based on the deployment's traffic allocation rules.
        </DocParagraph>

        <CodeBlock
          className="mt-4"
          language="typescript"
          code={`const prompt = await promptx.get("checkout-assistant", {
  sessionId: chat.id,
});`}
        />

        <Callout type="warning" className="mt-4">
          If an A/B test deployment is configured and no <InlineCode>sessionId</InlineCode> is
          provided, PromptX serves the version with the highest configured traffic allocation.
        </Callout>
      </DocSection>
      <DocDivider />

      <DocSection id="deploying" label="Workflow" title="Deploying a version">
        <StepList
          steps={[
            {
              title: "Choose a version",
              content:
                "Open the version timeline in the Prompt Studio. Select the version you want to deploy.",
            },

            {
              title: "Configure traffic allocation",
              content:
                "Set the traffic weight. For a full rollout, use 100%. For a canary, start with 5–10% alongside the existing version.",
            },
            {
              title: "Deploy",
              content:
                "Confirm the deployment. The SDK picks up the new version within seconds — no application restart required.",
            },
            {
              title: "Monitor",
              content:
                "Watch the Observability tab for error rates, latency, and custom metrics. Compare against the previous version.",
            },
          ]}
        />
      </DocSection>

      <DocDivider />

      <DocSection id="rollback" label="Recovery" title="Rollback">
        <DocParagraph>
          Rollback updates the active deployment to serve a previously deployed version. No new
          version is created and your version history remains unchanged.
        </DocParagraph>

        <DocH3 className="mt-5">From the dashboard</DocH3>

        <DocParagraph className="mt-2">
          Open the active deployment and click <InlineCode>Rollback</InlineCode>. You'll be asked to
          confirm the target version before the deployment is updated.
        </DocParagraph>

        <Callout type="note" className="mt-4">
          Rollbacks typically take effect within seconds. During this brief propagation period, some
          requests may continue to receive the previous deployment configuration.
        </Callout>
      </DocSection>

      <DocDivider />

      <DocSection id="guidelines" label="Best practices" title="Deployment guidelines">
        <DocList
          items={[
            "Validate new prompt versions thoroughly before deploying them to production traffic.",
            "Use A/B testing for significant prompt changes. Start with a small traffic allocation and increase it gradually as confidence grows.",
            "Always provide a stable sessionId when using A/B tests to ensure consistent version assignment.",
            "Monitor quality, latency, and business metrics after every deployment, especially during traffic splits.",
            "Use tags and version descriptions to document important changes and make future rollbacks easier.",
            "Keep previous stable versions available so you can quickly roll back if a deployment behaves unexpectedly.",
          ]}
        />
      </DocSection>
    </DocPageWrapper>
  );
}
