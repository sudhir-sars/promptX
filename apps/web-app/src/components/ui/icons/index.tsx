"use client";

import type { IconType } from "react-icons";
import { BiCommand } from "react-icons/bi";
import { CiBadgeDollar } from "react-icons/ci";
import { FaHouseFlag, FaNodeJs } from "react-icons/fa6";
import {
	FiAlertTriangle,
	FiArrowUp,
	FiBell,
	FiCheck,
	FiCheckCircle,
	FiChevronLeft,
	FiChevronRight,
	FiChevronUp,
	FiCompass,
	FiCopy,
	FiCreditCard,
	FiEdit3,
	FiLoader,
	FiLogOut,
	FiMail,
	FiMenu,
	FiMoon,
	FiPlus,
	FiSearch,
	FiSun,
	FiTrash2,
	FiUser,
	FiX,
} from "react-icons/fi";
import { HiMiniKey } from "react-icons/hi2";
import { IoIosAnalytics } from "react-icons/io";
import { IoLogIn, IoPeople, IoRocket } from "react-icons/io5";
import { MdCompare, MdOutlineApartment } from "react-icons/md";
import { RiFlowChart, RiLightbulbLine, RiLoginCircleLine, RiSettings6Fill, RiTeamLine } from "react-icons/ri";
import { SiGo, SiPython, SiReasonstudios, SiRust } from "react-icons/si";
import {
	TbApi,
	TbBrandNextjs,
	TbBuildingCommunity,
	TbChecklist,
	TbHomeFilled,
	TbLibrary,
	TbLogs,
	TbRobot,
	TbRouteAltLeft, // Roadmap
	TbTestPipe,
	TbTimeline, // Changelog
	TbVersionsFilled,
} from "react-icons/tb";

import { cn } from "@/lib/utils";

type IconProps = {
	className?: string;
	size?: number;
	strokeWidth?: number;
};

function createAnimatedIcon(Icon: IconType) {
	return function AnimatedIcon({ className, size = 18, animate = true }: IconProps & { animate?: boolean }) {
		return (
			<span
				className={cn("relative flex items-center justify-center overflow-hidden", className)}
				style={{
					width: size,
					height: size,
				}}
			>
				<Icon
					size={size}
					className={cn(
						"absolute transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
						animate
							? ["translate-y-0 opacity-100", "group-hover:-translate-y-full", "group-hover:opacity-0"]
							: "translate-y-0 opacity-100",
					)}
				/>

				{animate && (
					<Icon
						size={size}
						className={cn(
							"absolute translate-y-full opacity-0",
							"transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
							"group-hover:translate-y-0",
							"group-hover:opacity-100",
						)}
					/>
				)}
			</span>
		);
	};
}

export const HomeIcon = createAnimatedIcon(TbHomeFilled);
export const StudioIcon = createAnimatedIcon(SiReasonstudios);
export const EditIcon = createAnimatedIcon(FiEdit3);
export const LoginIcon = createAnimatedIcon(IoLogIn);

export const OrgIcon = createAnimatedIcon(MdOutlineApartment);
export const BuildingIcon = createAnimatedIcon(TbBuildingCommunity);
export const NodejsIcon = createAnimatedIcon(FaNodeJs);

export const DiscoverIcon = createAnimatedIcon(FiCompass);
export const GameIcon = createAnimatedIcon(TbTestPipe);
export const MenuIcon = createAnimatedIcon(FiMenu);
export const AgentIcon = createAnimatedIcon(TbRobot);
export const FlowIcon = createAnimatedIcon(RiFlowChart);
export const APIIcon = createAnimatedIcon(TbApi);
export const OverviewIcon = createAnimatedIcon(TbChecklist);
export const PromptIcon = createAnimatedIcon(FiEdit3);
export const PythonIcon = createAnimatedIcon(SiPython);
export const RustIcon = createAnimatedIcon(SiRust);
export const GoIcon = createAnimatedIcon(SiGo);
export const VersionsIcon = createAnimatedIcon(TbVersionsFilled);
export const DeployIcon = createAnimatedIcon(IoRocket);

export const SearchIcon = createAnimatedIcon(FiSearch);
export const SettingsIcon = createAnimatedIcon(RiSettings6Fill);

export const ChangelogIcon = createAnimatedIcon(TbTimeline);
export const RoadmapIcon = createAnimatedIcon(TbRouteAltLeft);
export const PricingIcon = createAnimatedIcon(CiBadgeDollar);
export const CompareIcon = createAnimatedIcon(MdCompare);

export const GettingStartedIcon = createAnimatedIcon(FaHouseFlag);
export const NextjsIcon = createAnimatedIcon(TbBrandNextjs);
export const ExampleIcon = createAnimatedIcon(RiLightbulbLine);
export const MigrationIcon = createAnimatedIcon(RiLoginCircleLine);

export const UserIcon = createAnimatedIcon(FiUser);
export const MembersIcon = createAnimatedIcon(IoPeople);
export const TeamIcon = createAnimatedIcon(RiTeamLine);

export const ActivityIcon = createAnimatedIcon(TbLogs);
export const ObservabilityIcon = createAnimatedIcon(IoIosAnalytics);

export const BellIcon = createAnimatedIcon(FiBell);

export const SunIcon = createAnimatedIcon(FiSun);
export const MoonIcon = createAnimatedIcon(FiMoon);

export const CreditCardIconComponent = createAnimatedIcon(FiCreditCard);
export const APIKeyIcon = createAnimatedIcon(HiMiniKey);

export const LogoutIcon = createAnimatedIcon(FiLogOut);

export const CheckIcon = createAnimatedIcon(FiCheckCircle);
export const Tick04Icon = createAnimatedIcon(FiCheckCircle);
export const TickIcon = createAnimatedIcon(FiCheck);

export const CloseIcon = createAnimatedIcon(FiX);
export const AlertIcon = createAnimatedIcon(FiAlertTriangle);

export const ChevronUpIcon = createAnimatedIcon(FiChevronUp);
export const ChevronLeftIcon = createAnimatedIcon(FiChevronLeft);
export const ChevronRightIcon = createAnimatedIcon(FiChevronRight);

export const ArrowUpIcon = createAnimatedIcon(FiArrowUp);

export const PlusIcon = createAnimatedIcon(FiPlus);
export const PlusCircleIcon = createAnimatedIcon(FiPlus);

export const ContactUs = createAnimatedIcon(FiMail);

export const CopyIcon = createAnimatedIcon(FiCopy);

export const LoadingIcon = createAnimatedIcon(FiLoader);

export const CommandKeyIcon = createAnimatedIcon(BiCommand);

export const FoundryIcon = createAnimatedIcon(TbLibrary);

export const TrashIcon = createAnimatedIcon(FiTrash2);
