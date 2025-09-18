const { default: mongoose } = require("mongoose");
const connectDB = require("../config/db");

const blockSchema = new mongoose.Schema(
	{
		id: {
			type: Number,
			required: true,
		},
		type: {
			type: String,
			required: true,
			enum: ["container", "text", "image", "button", "form", "video", "custom"],
		},
		label: {
			type: String,
			required: true,
		},
		content: {
			type: String,
			default: "",
		},
		options: {
			type: mongoose.Schema.Types.Mixed,
			default: {},
		},
		children: [
			{
				type: mongoose.Schema.Types.Mixed,
			},
		],
		parent_id: {
			type: Number,
			default: null,
		},
	},
	{ _id: false }
);

// Site Schema
const siteSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
			trim: true,
		},
		domain: {
			type: String,
			required: true,
			unique: true,
			lowercase: true,
		},
		description: {
			type: String,
			trim: true,
		},
		settings: {
			theme: {
				type: String,
				default: "default",
			},
			customCSS: {
				type: String,
				default: "",
			},
			favicon: {
				type: String,
				default: "",
			},
			analytics: {
				google: String,
				facebook: String,
			},
		},
		user_id: {
			type: String,
			required: true,
			index: true,
		},
		status: {
			type: String,
			enum: ["active", "inactive", "draft"],
			default: "draft",
		},
	},
	{
		timestamps: {
			createdAt: "created_at",
			updatedAt: "updated_at",
		},
	}
);

// Page Schema
const pageSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
			trim: true,
		},
		slug: {
			type: String,
			required: true,
			lowercase: true,
			trim: true,
		},
		status: {
			type: String,
			enum: ["published", "draft", "archived"],
			default: "draft",
		},
		page_data: {
			blocks: [blockSchema],
			editorData: {
				type: mongoose.Schema.Types.Mixed,
				default: {},
			},
			settings: {
				title: String,
				description: String,
				keywords: [String],
				customCSS: String,
				customJS: String,
			},
		},
		user_id: {
			type: String,
			required: true,
			index: true,
		},
		metadata: {
			views: {
				type: Number,
				default: 0,
			},
			lastModified: {
				type: Date,
				default: Date.now,
			},
		},
	},
	{
		timestamps: {
			createdAt: "created_at",
			updatedAt: "updated_at",
		},
	}
);

// User Schema
const userSchema = new mongoose.Schema(
	{
		user_id: {
			type: String,
			required: true,
			unique: true,
		},
		email: {
			type: String,
			required: true,
			unique: true,
			lowercase: true,
		},
		name: {
			type: String,
			required: true,
		},
		avatar: String,
		role: {
			type: String,
			enum: ["admin", "editor", "viewer"],
			default: "editor",
		},
		preferences: {
			theme: {
				type: String,
				default: "light",
			},
			language: {
				type: String,
				default: "en",
			},
		},
		subscription: {
			plan: {
				type: String,
				enum: ["free", "pro", "enterprise"],
				default: "free",
			},
			expiresAt: Date,
			features: [String],
		},
	},
	{
		timestamps: {
			createdAt: "created_at",
			updatedAt: "updated_at",
		},
	}
);

// Create indexes for better performance
pageSchema.index({ user_id: 1, slug: 1 });
pageSchema.index({ site_id: 1, status: 1 });
siteSchema.index({ user_id: 1, domain: 1 });

// Create models
const Site = mongoose.model("Site", siteSchema);
const Page = mongoose.model("Page", pageSchema);
const User = mongoose.model("User", userSchema);

module.exports = {
	Site,
	Page,
	User,
	connectDB,
};
