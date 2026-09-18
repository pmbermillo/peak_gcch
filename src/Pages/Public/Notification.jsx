
import React, { useState } from "react";
import { BookmarkIcon } from '@heroicons/react/24/outline'
import { PostNotification } from '../../Api/Module/DashboardApi.jsx';
import { toast } from 'react-toastify';

const Section = ({
    id,
    title,
    description,
    link,
    children,
    className = "",
    isOpen,
    toggleSection,
}) => {
    return (
        <div
            className={`border border-gray-200 rounded-xl overflow-hidden bg-white ${className}`}
        >
            <button
                type="button"
                onClick={() => toggleSection(id)}
                className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50 transition"
            >
                <div>
                    <h3 className="font-semibold text-gray-800">
                        {title}
                    </h3>

                    {description && (
                        <p className="text-xs text-gray-500 mt-1">
                            {description}
                        </p>
                    )}
                </div>

                <svg
                    className={`w-5 h-5 text-gray-400 transition-transform ${
                        isOpen ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 9l-7 7-7-7"
                    />
                </svg>
            </button>

            {isOpen && (
                <div className="px-5 pb-5 border-t border-gray-100">
                    <div className="pt-5">
                        {children}
                    </div>
                </div>
            )}
        </div>
    );
};

const Notification = () => {
    const [openSections, setOpenSections] = useState({
        content: true,
        settings: true,
        schedule: false,
        targeting: false,
    });

    const [form, setForm] = useState({
        type: "announcement",
        title: "",
        content: "",
        priority: "normal",
        status: "draft",
        link: "",
        publish_at: "",
        expires_at: "",
    });

    const toggleSection = (section) => {
        setOpenSections((prev) => ({
            ...prev,
            [section]: !prev[section],
        }));
    };

    const handleChange = (e) => {
        const { name, value, type, checked, files } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]:
                type === "checkbox"
                    ? checked
                    : type === "file"
                    ? files[0]
                    : value,
        }));
    };

    const saveNotification = async (e) => {
        e.preventDefault();

        try {
            const response = await PostNotification(form);

            console.log(response);

            // await fetchData();
            clearForm();
            // setShowFaqForm(false);
            // setExpandedFaq(null);

            toast.success(response.data.message);

        } catch (error) {
            console.error('Error submitting form:', error);

            toast.error(
                error.response?.data?.errors?.message?.[0] ??
                error.response?.data?.message ??
                'Failed to submit form.'
            );
        }
    }

    const clearForm = () => {
        setForm({
            type: "announcement",
            title: "",
            content: "",
            priority: "normal",
            status: "draft",
            link: "",
            publish_at: "",
            expires_at: "",
        });
    }
      

    return (
        <div className="mx-auto">
            {/* Header */}
            <div className="mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-gray-900 flex items-center justify-center">
                        <svg
                            className="w-6 h-6 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                            />
                        </svg>
                    </div>

                    <div>
                        <h1 className="text-xl font-bold text-gray-800">
                            Create Notification
                        </h1>

                        <p className="text-sm text-gray-500">
                            Create an announcement, alert, or news feed post.
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left side: Form */}
                <div className="space-y-4 h-[600px] overflow-y-auto">
                    {/* Content */}
                    <Section
                        id="content"
                        title="Content"
                        description="Add the main information users will see."
                        className="mb-4 border border-gray-300 rounded-xl overflow-hidden bg-blue-50"
                        isOpen={openSections.content}
                        toggleSection={toggleSection}
                    >
                        <div className="space-y-5">
                            {/* Type */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Notification Type
                                </label>

                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                    {[
                                        {
                                            value: "announcement",
                                            label: "Announcement",
                                            description: "General information",
                                        },
                                        {
                                            value: "alert",
                                            label: "Alert",
                                            description: "Important notice",
                                        },
                                        {
                                            value: "newsfeed",
                                            label: "News Feed",
                                            description: "News or updates",
                                        },
                                    ].map((item) => (
                                        <label
                                            key={item.value}
                                            className={`cursor-pointer rounded-xl border p-4 transition ${
                                                form.type === item.value
                                                    ? "border-gray-900 bg-gray-50 ring-1 ring-gray-900"
                                                    : "border-gray-200 hover:border-gray-300"
                                            }`}
                                        >
                                            <input
                                                type="radio"
                                                name="type"
                                                value={item.value}
                                                checked={form.type === item.value}
                                                onChange={handleChange}
                                                className="sr-only"
                                            />

                                            <div className="font-medium text-sm text-gray-800">
                                                {item.label}
                                            </div>

                                            <div className="text-xs text-gray-500 mt-1">
                                                {item.description}
                                            </div>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Title */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Title
                                </label>

                                <input
                                    type="text"
                                    name="title"
                                    value={form.title}
                                    onChange={handleChange}
                                    placeholder="Enter notification title"
                                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-gray-900 focus:ring-1 focus:ring-gray-900 outline-none"
                                />
                            </div>

                            {/* Message */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Message
                                </label>

                                <textarea
                                    name="content"
                                    value={form.content}
                                    onChange={handleChange}
                                    rows={5}
                                    placeholder="Write your notification message..."
                                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm resize-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900 outline-none"
                                />
                            </div>

                            {/* Link */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Link
                                </label>

                                <input
                                    type="url"
                                    name="link"
                                    value={form.link}
                                    onChange={handleChange}
                                    placeholder="https://..."
                                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-gray-900 focus:ring-1 focus:ring-gray-900 outline-none"
                                />

                                <p className="text-xs text-gray-400 mt-1">
                                    Optional link users can open.
                                </p>
                            </div>
                        </div>
                    </Section>

                    {/* Settings */}
                    <Section
                        id="settings"
                        title="Settings"
                        description="Configure how the notification should behave."
                        isOpen={openSections.settings}
                        toggleSection={toggleSection}
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            {/* Priority */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Priority
                                </label>

                                <select
                                    name="priority"
                                    value={form.priority}
                                    onChange={handleChange}
                                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm bg-white focus:border-gray-900 focus:ring-1 focus:ring-gray-900 outline-none"
                                >
                                    <option value="low">Low</option>
                                    <option value="normal">Normal</option>
                                    <option value="high">High</option>
                                    <option value="urgent">Urgent</option>
                                </select>
                            </div>

                            {/* Status */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Status
                                </label>

                                <select
                                    name="status"
                                    value={form.status}
                                    onChange={handleChange}
                                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm bg-white focus:border-gray-900 focus:ring-1 focus:ring-gray-900 outline-none"
                                >
                                    <option value="draft">Draft</option>
                                    <option value="published">Published</option>
                                    <option value="archived">Archived</option>
                                </select>
                            </div>
                        </div>
                    </Section>

                    {/* Schedule */}
                    <Section
                        id="schedule"
                        title="Schedule"
                        description="Control when the notification becomes visible."
                        isOpen={openSections.schedule}
                        toggleSection={toggleSection}
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            {/* Publish date */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Publish Date & Time
                                </label>

                                <input
                                    type="datetime-local"
                                    name="publish_at"
                                    value={form.publish_at}
                                    onChange={handleChange}
                                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-gray-900 focus:ring-1 focus:ring-gray-900 outline-none"
                                />
                            </div>

                            {/* Expiration date */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Expiration Date & Time
                                </label>

                                <input
                                    type="datetime-local"
                                    name="expires_at"
                                    value={form.expires_at}
                                    onChange={handleChange}
                                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-gray-900 focus:ring-1 focus:ring-gray-900 outline-none"
                                />
                            </div>
                        </div>
                    </Section>

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-3">
                        <button
                            type="button"
                            className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl border border-gray-300 bg-white text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 active:scale-[0.98] transition-all duration-200"
                        >
                            Cancel
                        </button>

                        <button
                            type="button"
                            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-medium shadow-sm hover:bg-indigo-700 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 active:scale-[0.98] transition-all duration-200"
                            onClick={saveNotification}
                        >
                            <BookmarkIcon className="w-5 h-5" />
                            <span>Save Notification</span>
                        </button>
                    </div>
                </div>

                {/* Right side: Table */}
                <div className="lg:col-span-2">
                    Table
                </div>
            </div>
        </div>
    );
};

export default Notification;