import { useState } from "react";
import { useCollaboration } from "../hooks/useCollaboration";
import { Users, Activity, Eye, EyeOff } from "lucide-react";

const CollaborationIndicators = ({ blockId, className = "" }) => {
	const {
		getTypingUsersForBlock,
		getCursorsForBlock,
		hasActiveCollaborators,
		recentActivity,
		isSocketConnected,
	} = useCollaboration();

	const [showActivity, setShowActivity] = useState(false);
	const typingUsers = getTypingUsersForBlock(blockId);
	const cursors = getCursorsForBlock(blockId);

	if (!hasActiveCollaborators || !isSocketConnected) {
		return null;
	}

	return (
		<div className={`relative ${className}`}>
			{/* Typing Indicators */}
			{typingUsers.length > 0 && (
				<div className="absolute -top-6 left-0 flex items-center gap-1 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full border border-blue-200 z-10">
					<div className="flex gap-1">
						<div className="w-1 h-1 bg-blue-500 rounded-full animate-bounce"></div>
						<div className="w-1 h-1 bg-blue-500 rounded-full animate-bounce delay-100"></div>
						<div className="w-1 h-1 bg-blue-500 rounded-full animate-bounce delay-200"></div>
					</div>
					<span className="ml-1">
						{typingUsers.length === 1
							? `${typingUsers[0].user?.name || "Someone"} is typing...`
							: `${typingUsers.length} people typing...`}
					</span>
				</div>
			)}

			{/* Cursors Indicators */}
			{cursors.map((cursor, index) => (
				<div
					key={cursor.userId}
					className="absolute -top-2 bg-green-100 text-green-800 text-xs px-1 rounded border border-green-200 z-10"
					style={{
						left: `${Math.min(cursor.position?.x || 0, 200)}px`,
						transform: "translateX(-50%)",
					}}>
					<div className="flex items-center gap-1">
						<div className="w-1 h-1 bg-green-500 rounded-full"></div>
						<span>{cursor.user?.name || "User"}</span>
					</div>
				</div>
			))}

			{/* Activity Toggle Button */}
			<button
				onClick={() => setShowActivity(!showActivity)}
				className="absolute -top-8 right-0 flex items-center gap-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded-full border z-10 transition-colors"
				title="Show recent activity">
				<Activity className="w-3 h-3" />
				{showActivity ? (
					<EyeOff className="w-3 h-3" />
				) : (
					<Eye className="w-3 h-3" />
				)}
			</button>

			{/* Activity Feed */}
			{showActivity && (
				<div className="absolute top-0 right-0 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-20 max-h-64 overflow-y-auto">
					<div className="p-3 border-b border-gray-100">
						<h4 className="font-medium text-gray-900 text-sm flex items-center gap-2">
							<Activity className="w-4 h-4" />
							Recent Activity
						</h4>
					</div>
					<div className="p-2">
						{recentActivity.length > 0 ? (
							<div className="space-y-2">
								{recentActivity.map((activity, index) => (
									<div
										key={activity.id || index}
										className="flex items-start gap-2 text-xs">
										<div className="w-2 h-2 bg-blue-400 rounded-full mt-1 flex-shrink-0"></div>
										<div>
											<p className="text-gray-700">{activity.displayText}</p>
											<p className="text-gray-500 text-xs">
												{activity.timeAgo}
											</p>
										</div>
									</div>
								))}
							</div>
						) : (
							<p className="text-gray-500 text-xs">No recent activity</p>
						)}
					</div>
				</div>
			)}
		</div>
	);
};

const TypingIndicator = ({ blockId, compact = false }) => {
	const { getTypingUsersForBlock } = useCollaboration();
	const typingUsers = getTypingUsersForBlock(blockId);

	if (typingUsers.length === 0) return null;

	if (compact) {
		return (
			<div className="flex items-center gap-1 text-blue-600 text-xs">
				<div className="flex gap-0.5">
					<div className="w-1 h-1 bg-blue-500 rounded-full animate-bounce"></div>
					<div className="w-1 h-1 bg-blue-500 rounded-full animate-bounce delay-75"></div>
					<div className="w-1 h-1 bg-blue-500 rounded-full animate-bounce delay-150"></div>
				</div>
				<span>{typingUsers.length}</span>
			</div>
		);
	}

	return (
		<div className="flex items-center gap-2 text-blue-600 text-sm bg-blue-50 px-2 py-1 rounded-full border border-blue-200">
			<div className="flex gap-1">
				<div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce"></div>
				<div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce delay-100"></div>
				<div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce delay-200"></div>
			</div>
			<span>
				{typingUsers.length === 1
					? `${typingUsers[0].user?.name || "Someone"} is typing`
					: `${typingUsers.length} people typing`}
			</span>
		</div>
	);
};

const CollaboratorAvatars = ({ limit = 3 }) => {
	const { connectedUsers } = useCollaboration();

	if (connectedUsers.length === 0) return null;

	const displayUsers = connectedUsers.slice(0, limit);
	const remainingCount = Math.max(0, connectedUsers.length - limit);

	return (
		<div className="flex items-center gap-1">
			{displayUsers.map((user, index) => (
				<div
					key={user.userId}
					className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-sm font-medium border-2 border-white shadow-sm"
					style={{ zIndex: displayUsers.length - index }}
					title={user.name || `User ${user.userId}`}>
					{(user.name || user.userId || "U").charAt(0).toUpperCase()}
				</div>
			))}
			{remainingCount > 0 && (
				<div className="w-8 h-8 rounded-full bg-gray-400 flex items-center justify-center text-white text-xs font-medium border-2 border-white shadow-sm">
					+{remainingCount}
				</div>
			)}
		</div>
	);
};

export { CollaborationIndicators, TypingIndicator, CollaboratorAvatars };
