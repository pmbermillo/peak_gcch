import React, { useEffect, useState } from 'react';
import { GetNotifications, submitSuggestion } from '../../Api/Module/DashboardApi.jsx';
import { Link } from "react-router-dom"
import { toast } from "react-toastify";

const Dashboard = () => {

    const timezones = [
        {
            name: 'Pacific Time',
            city: 'Los Angeles',
            timezone: 'America/Los_Angeles',
            icon: '🇺🇸',
        },
        {
            name: 'Mountain Time',
            city: 'Denver',
            timezone: 'America/Denver',
            icon: '🇺🇸',
        },
        {
            name: 'Central Time',
            city: 'Chicago',
            timezone: 'America/Chicago',
            icon: '🇺🇸',
        },
        {
            name: 'Eastern Time',
            city: 'New York',
            timezone: 'America/New_York',
            icon: '🇺🇸',
        },
        {
            name: 'Belize Time',
            city: 'Belize City',
            timezone: 'America/Belize',
            icon: '🇧🇿',
        },
        {
            name: 'Philippine Time',
            city: 'Manila',
            timezone: 'Asia/Manila',
            icon: '🇵🇭',
        },
    ];

    const [currentTime, setCurrentTime] = useState(new Date());
    const [notifications, setNotifications] = useState([]);
    const [showSuggestionBox, setShowSuggestionBox] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => clearInterval(timer);
    }, []);
    
    const fetchNotifications = async () => {
        try {
            const response = await GetNotifications();

            console.log('FULL RESPONSE:', response);
            console.log('RESPONSE DATA:', response.data);

            const data = Array.isArray(response.data?.[0])
                ? response.data[0]
                : [];

            console.log('NOTIFICATIONS:', data);

            setNotifications(data);

        } catch (error) {
            console.error('Error fetching notification data:', error);
            setNotifications([]);
        }
    };

    const [closedAnnouncementIds, setClosedAnnouncementIds] = useState(() => {
        const saved = sessionStorage.getItem('closed_announcement_ids');

        return saved ? JSON.parse(saved) : [];
    });

    const alerts = notifications.filter(
        notification => notification.type === 'alert'
    );

    const announcements = notifications.filter(
        notification => notification.type === 'announcement'
    );

    const news = notifications.filter(
        notification => notification.type === 'news'
    );

    const activeAnnouncement = [...announcements]
    .sort(
        (a, b) =>
            new Date(b.publish_at || b.created_at) -
            new Date(a.publish_at || a.created_at)
    )
    .find(
        announcement => !closedAnnouncementIds.includes(announcement.id)
    );

    const closeAnnouncement = () => {
        if (!activeAnnouncement) return;

        const updatedClosedIds = [
            ...closedAnnouncementIds,
            activeAnnouncement.id
        ];

        setClosedAnnouncementIds(updatedClosedIds);

        sessionStorage.setItem(
            'closed_announcement_ids',
            JSON.stringify(updatedClosedIds)
        );
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

    const formatTime = (timezone) => {
        return new Intl.DateTimeFormat('en-US', {
            timeZone: timezone,
            hour: 'numeric',
            minute: '2-digit',
            second: '2-digit',
            hour12: true,
        }).format(currentTime);
    };

    const formatDate = (timezone) => {
        return new Intl.DateTimeFormat('en-US', {
            timeZone: timezone,
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        }).format(currentTime);
    };

    const handleSubmitSuggestion = async (e) => {
        e.preventDefault();

        try {
            const response = await submitSuggestion({ suggestion: message });
            console.log(response);
            toast.success(response.data.message);
            setMessage(''); // Clear the message after successful submission
        } catch (error) {
            console.log(error);
            toast.error(
                error.response?.data?.errors?.suggestion?.[0] ??
                error.response?.data?.error ??
                'Failed to submit suggestion.'
            );
            return;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 px-4 py-6">
            {/* =====================================================
                ANNOUNCEMENT MODAL
            ====================================================== */}
            {activeAnnouncement && (
                <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
                    
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

                    {/* Modal */}
                    <div
                        className="
                            relative
                            w-full
                            max-w-lg
                            bg-white
                            rounded-2xl
                            shadow-2xl
                            overflow-hidden
                        "
                    >
                        {/* Header */}
                        <div className="px-6 py-5 border-b border-gray-100">
                            <div className="flex items-start justify-between gap-4">

                                <div className="flex items-start gap-3">
                                    <div
                                        className="
                                            w-11
                                            h-11
                                            flex
                                            items-center
                                            justify-center
                                            bg-blue-50
                                            rounded-xl
                                            text-xl
                                            flex-shrink-0
                                        "
                                    >
                                        📢
                                    </div>

                                    <div>
                                        <p className="text-[10px] font-bold uppercase tracking-wide text-blue-600 mb-1">
                                            Announcement
                                        </p>

                                        <h2 className="text-lg font-bold text-gray-800">
                                            {activeAnnouncement.title || 'Announcement'}
                                        </h2>
                                    </div>
                                </div>

                                {/* Close button */}
                                <button
                                    type="button"
                                    onClick={closeAnnouncement}
                                    className="
                                        flex-shrink-0
                                        w-8
                                        h-8
                                        flex
                                        items-center
                                        justify-center
                                        rounded-lg
                                        text-gray-400
                                        hover:text-gray-600
                                        hover:bg-gray-100
                                        transition
                                    "
                                    aria-label="Close announcement"
                                >
                                    ✕
                                </button>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="px-6 py-5">

                            {activeAnnouncement.priority && (
                                <span
                                    className={`
                                        inline-flex
                                        px-2.5
                                        py-1
                                        text-[10px]
                                        font-bold
                                        rounded-full
                                        uppercase
                                        mb-4
                                        ${
                                            activeAnnouncement.priority === 'urgent'
                                                ? 'text-red-600 bg-red-50'
                                                : activeAnnouncement.priority === 'high'
                                                    ? 'text-orange-600 bg-orange-50'
                                                    : 'text-blue-600 bg-blue-50'
                                        }
                                    `}
                                >
                                    {activeAnnouncement.priority}
                                </span>
                            )}

                            {activeAnnouncement.content && (
                                <div className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                                    {activeAnnouncement.content}
                                </div>
                            )}

                            {/* Links */}
                            {activeAnnouncement.links && (
                                <div className="flex flex-wrap gap-2 mt-5">
                                    {activeAnnouncement.links
                                        .split(',')
                                        .map(link => link.trim())
                                        .filter(Boolean)
                                        .map((link, index) => (
                                            <a
                                                key={index}
                                                href={link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="
                                                    inline-flex
                                                    items-center
                                                    gap-1.5
                                                    px-3
                                                    py-2
                                                    text-xs
                                                    font-semibold
                                                    text-blue-600
                                                    bg-blue-50
                                                    border
                                                    border-blue-100
                                                    rounded-lg
                                                    hover:bg-blue-100
                                                    hover:text-blue-700
                                                    transition
                                                "
                                            >
                                                🔗
                                                {activeAnnouncement.links
                                                    .split(',')
                                                    .filter(Boolean).length > 1
                                                    ? `Link ${index + 1}`
                                                    : 'Open Link'}
                                            </a>
                                        ))}
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div
                            className="
                                px-6
                                py-4
                                bg-gray-50
                                border-t
                                border-gray-100
                                flex
                                justify-end
                            "
                        >
                            <button
                                type="button"
                                onClick={closeAnnouncement}
                                className="
                                    px-4
                                    py-2
                                    text-sm
                                    font-semibold
                                    text-white
                                    bg-blue-600
                                    rounded-lg
                                    hover:bg-blue-700
                                    transition
                                "
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="w-full mb-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-6">

                    {/* Welcome */}
                    <div className="flex-1">
                        <p className="text-sm text-gray-500 mb-1">
                            Welcome back
                        </p>

                        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                            Good day! 👋
                        </h1>

                        <p className="text-sm text-gray-500 mt-1">
                            Here's what's happening in your organization today.
                        </p>
                    </div>

                    {/* Alerts */}
                    {alerts.slice(0, 3).map((alert) => {
                        const links = alert.links
                            ? alert.links
                                .split(',')
                                .map(link => link.trim())
                                .filter(Boolean)
                            : [];

                        return (
                            <div
                                key={alert.id}
                                className="
                                    relative
                                    flex
                                    items-start
                                    gap-3
                                    px-3
                                    py-3
                                    pl-4
                                    bg-red-50/50
                                    border
                                    border-red-100
                                    rounded-xl
                                    hover:bg-red-50
                                    transition
                                    overflow-hidden
                                "
                            >
                                {/* Red accent line */}
                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-500" />

                                <span className="text-sm flex-shrink-0 mt-0.5">
                                    🔔
                                </span>

                                <div className="flex-1 min-w-0">

                                    {/* Title */}
                                    <p className="text-xs font-semibold text-gray-700">
                                        {alert.title || 'Untitled Alert'}
                                    </p>

                                    {/* Content */}
                                    {alert.content && (
                                        <p className="text-[11px] text-gray-500 mt-0.5">
                                            {alert.content}
                                        </p>
                                    )}

                                    {/* Links */}
                                    {links.length > 0 && (
                                        <div className="flex flex-wrap gap-2 mt-2">
                                            {links.map((link, index) => (
                                                <a
                                                    key={index}
                                                    href={link}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="
                                                        inline-flex
                                                        items-center
                                                        gap-1
                                                        px-2
                                                        py-1
                                                        text-[10px]
                                                        font-semibold
                                                        text-blue-600
                                                        bg-blue-50
                                                        border
                                                        border-blue-100
                                                        rounded-lg
                                                        hover:bg-blue-100
                                                        hover:text-blue-700
                                                        transition
                                                    "
                                                    onClick={(e) => e.stopPropagation()}
                                                >
                                                    🔗
                                                    {links.length > 1
                                                        ? `Link ${index + 1}`
                                                        : 'Open Link'}
                                                </a>
                                            ))}
                                        </div>
                                    )}

                                </div>

                                {/* Priority */}
                                {alert.priority && (
                                    <span
                                        className="
                                            flex-shrink-0
                                            px-2
                                            py-0.5
                                            text-[9px]
                                            font-semibold
                                            text-red-600
                                            bg-red-100
                                            rounded-full
                                            capitalize
                                        "
                                    >
                                        {alert.priority}
                                    </span>
                                )}
                            </div>
                        );
                    })}

                </div>
            </div>

            <div className="w-full space-y-6">
                <div
                    className="
                        bg-white
                        rounded-2xl
                        border
                        border-gray-200
                        shadow-sm
                        p-5
                    "
                >
                    <div className="flex items-center justify-between mb-5">
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="text-xl">
                                    🌎
                                </span>
                                <h2 className="text-lg font-bold text-gray-800">
                                    World Clock
                                </h2>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                                Current time across different locations
                            </p>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                        {timezones.map((zone) => (
                            <div
                                key={zone.timezone}
                                className="
                                    group
                                    p-4
                                    bg-gray-50
                                    border
                                    border-gray-100
                                    rounded-xl
                                    hover:bg-blue-50
                                    hover:border-blue-100
                                    transition
                                "
                            >
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="text-lg">
                                        {zone.icon}
                                    </span>
                                    <p className="text-xs font-semibold text-gray-600">
                                        {zone.name}
                                    </p>
                                </div>
                                <p className="text-xl font-bold text-gray-800 tracking-tight">
                                    {formatTime(zone.timezone)}
                                </p>
                                <p className="text-[11px] text-gray-400 mt-1">
                                    {zone.city}
                                </p>
                                <p className="text-[10px] text-gray-400">
                                    {formatDate(zone.timezone)}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

               {/* =====================================================
                    NEWS FEED
                ====================================================== */}
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                    {/* =====================================================
                        NEWS FEED
                    ====================================================== */}
                    <div
                        className="
                            w-full
                            bg-white
                            rounded-2xl
                            border
                            border-gray-200
                            shadow-sm
                            overflow-hidden
                        "
                    >

                        {/* Header */}
                        <div className="px-5 py-4 border-b border-gray-100 bg-gradient-to-r from-indigo-50 to-white">
                            <div className="flex items-center justify-between">

                                <div className="flex items-center gap-3">

                                    <div
                                        className="
                                            w-11
                                            h-11
                                            flex
                                            items-center
                                            justify-center
                                            bg-indigo-100
                                            rounded-xl
                                            text-xl
                                        "
                                    >
                                        📰
                                    </div>

                                    <div>
                                        <div className="flex items-center gap-2">

                                            <h2 className="text-base font-bold text-gray-800">
                                                News Feed
                                            </h2>

                                            <span
                                                className="
                                                    px-2
                                                    py-0.5
                                                    text-[9px]
                                                    font-bold
                                                    uppercase
                                                    tracking-wide
                                                    text-indigo-600
                                                    bg-indigo-100
                                                    rounded-full
                                                "
                                            >
                                                Latest
                                            </span>

                                        </div>

                                        <p className="text-xs text-gray-500 mt-0.5">
                                            Latest news and updates
                                        </p>
                                    </div>

                                </div>

                                {/* News count */}
                                <span
                                    className="
                                        min-w-[28px]
                                        h-7
                                        px-2
                                        flex
                                        items-center
                                        justify-center
                                        text-xs
                                        font-bold
                                        text-indigo-600
                                        bg-indigo-50
                                        rounded-full
                                    "
                                >
                                    {news.length}
                                </span>

                            </div>
                        </div>

                        {/* News Items */}
                        <div className="h-[400px] overflow-y-auto">

                            {news
                                .slice()
                                .sort(
                                    (a, b) =>
                                        new Date(b.publish_at || b.created_at) -
                                        new Date(a.publish_at || a.created_at)
                                )
                                .slice(0, 10)
                                .map((item, index) => {

                                    const links = item.links
                                        ? item.links
                                            .split(',')
                                            .map(link => link.trim())
                                            .filter(Boolean)
                                        : [];

                                    return (
                                        <div
                                            key={item.id}
                                            className="
                                                group
                                                px-5
                                                py-4
                                                border-b
                                                border-gray-100
                                                hover:bg-indigo-50/40
                                                transition
                                            "
                                        >
                                            <div className="flex gap-3">

                                                <div className="flex-shrink-0">
                                                    <div
                                                        className="
                                                            w-9
                                                            h-9
                                                            flex
                                                            items-center
                                                            justify-center
                                                            bg-gray-50
                                                            border
                                                            border-gray-100
                                                            rounded-lg
                                                            text-sm
                                                            group-hover:bg-white
                                                            group-hover:border-indigo-100
                                                            transition
                                                        "
                                                    >
                                                        {index === 0 ? '✨' : '📰'}
                                                    </div>
                                                </div>

                                                <div className="flex-1 min-w-0">

                                                    <h3
                                                        className="
                                                            text-sm
                                                            font-semibold
                                                            text-gray-800
                                                            group-hover:text-indigo-700
                                                            transition
                                                        "
                                                    >
                                                        {item.title || 'Untitled News'}
                                                    </h3>

                                                    {item.content && (
                                                        <p
                                                            className="
                                                                text-xs
                                                                text-gray-500
                                                                mt-1.5
                                                                leading-relaxed
                                                            "
                                                        >
                                                            {item.content}
                                                        </p>
                                                    )}

                                                    <div className="flex flex-wrap items-center gap-3 mt-3">

                                                        {(item.publish_at || item.created_at) && (
                                                            <span className="text-[10px] text-gray-400">
                                                                🕒{' '}
                                                                {new Date(
                                                                    item.publish_at || item.created_at
                                                                ).toLocaleDateString(
                                                                    undefined,
                                                                    {
                                                                        year: 'numeric',
                                                                        month: 'short',
                                                                        day: 'numeric'
                                                                    }
                                                                )}
                                                            </span>
                                                        )}

                                                        {item.priority && (
                                                            <span
                                                                className="
                                                                    px-2
                                                                    py-0.5
                                                                    text-[9px]
                                                                    font-semibold
                                                                    text-gray-500
                                                                    bg-gray-100
                                                                    rounded-full
                                                                    capitalize
                                                                "
                                                            >
                                                                {item.priority}
                                                            </span>
                                                        )}

                                                    </div>

                                                    {links.length > 0 && (
                                                        <div className="flex flex-wrap gap-2 mt-3">

                                                            {links.map((link, linkIndex) => (
                                                                <a
                                                                    key={linkIndex}
                                                                    href={link}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="
                                                                        inline-flex
                                                                        items-center
                                                                        gap-1.5
                                                                        px-3
                                                                        py-1.5
                                                                        text-[10px]
                                                                        font-semibold
                                                                        text-indigo-600
                                                                        bg-white
                                                                        border
                                                                        border-indigo-200
                                                                        rounded-lg
                                                                        hover:bg-indigo-600
                                                                        hover:text-white
                                                                        hover:border-indigo-600
                                                                        transition
                                                                    "
                                                                    onClick={(e) =>
                                                                        e.stopPropagation()
                                                                    }
                                                                >
                                                                    🔗
                                                                    {links.length > 1
                                                                        ? `Link ${linkIndex + 1}`
                                                                        : 'Open Link'}
                                                                </a>
                                                            ))}

                                                        </div>
                                                    )}

                                                </div>

                                            </div>
                                        </div>
                                    );
                                })}

                        </div>

                        {/* Footer */}
                        {news.length > 10 && (
                            <div
                                className="
                                    px-5
                                    py-3
                                    bg-gray-50
                                    border-t
                                    border-gray-100
                                "
                            >
                                <p className="text-[10px] text-gray-400 text-center">
                                    Showing the 10 most recent news updates
                                </p>
                            </div>
                        )}

                    </div>

                    {/* =====================================================
                    VIEW ALL NOTIFICATIONS
                    ====================================================== */}

                    <div className="w-full space-y-4">

                    {/* View All Notifications */}
                    <div
                        className="
                            w-full
                            bg-white
                            rounded-2xl
                            border
                            border-gray-200
                            shadow-sm
                            p-6
                            bg-gradient-to-r
                            from-indigo-50
                            to-white
                        "
                    >
                        <div className="flex items-center gap-3 mb-4">

                            <div
                                className="
                                    w-11
                                    h-11
                                    flex
                                    items-center
                                    justify-center
                                    bg-indigo-100
                                    rounded-xl
                                    text-xl
                                "
                            >
                                🔔
                            </div>

                            <div>
                                <h2 className="text-base font-bold text-gray-800">
                                    Notifications
                                </h2>

                                <p className="text-xs text-gray-500 mt-0.5">
                                    View all alerts, announcements, and news
                                </p>
                            </div>

                        </div>

                        <p className="text-sm text-gray-500 leading-relaxed mb-5">
                            Stay updated with the latest announcements, alerts,
                            and organization news.
                        </p>

                        <Link
                            to="/notification-management"
                            className="
                                inline-flex
                                items-center
                                justify-center
                                gap-2
                                w-full
                                px-4
                                py-2.5
                                text-sm
                                font-semibold
                                text-white
                                bg-indigo-600
                                rounded-lg
                                hover:bg-indigo-700
                                transition
                            "
                        >
                            View All Notifications
                            <span>→</span>
                        </Link>
                    </div>


                    {/* =====================================================
                        SUGGESTION BOX - COLLAPSIBLE
                    ====================================================== */}

                    <div
                        className="
                            bg-gradient-to-br
                            from-indigo-600
                            to-blue-700
                            rounded-2xl
                            shadow-sm
                            text-white
                            overflow-hidden
                        "
                    >

                        {/* Suggestion Box Header */}
                        <button
                            type="button"
                            onClick={() => setShowSuggestionBox(!showSuggestionBox)}
                            className="
                                w-full
                                flex
                                items-center
                                justify-between
                                p-6
                                text-left
                                hover:bg-white/5
                                transition
                            "
                        >
                            <div className="flex items-center gap-3">

                                <div
                                    className="
                                        w-11
                                        h-11
                                        flex
                                        items-center
                                        justify-center
                                        bg-white/15
                                        rounded-xl
                                        text-xl
                                    "
                                >
                                    💡
                                </div>

                                <div>
                                    <h2 className="font-bold text-lg">
                                        Suggestion Box
                                    </h2>

                                    <p className="text-xs text-blue-100">
                                        Help us improve
                                    </p>
                                </div>

                            </div>

                            {/* Collapse Icon */}
                            <span
                                className={`
                                    text-xl
                                    transition-transform
                                    duration-200
                                    ${showSuggestionBox ? "rotate-180" : ""}
                                `}
                            >
                                ▼
                            </span>

                        </button>


                        {/* Collapsible Content */}
                        {showSuggestionBox && (
                            <div className="px-6 pb-6">

                                <div className="border-t border-white/20 pt-5">

                                    <p className="text-sm text-blue-50 mb-5">
                                        Have an idea, suggestion, or improvement
                                        you'd like to share? Let us know.
                                    </p>

                                    <textarea
                                        rows="5"
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        placeholder="Share your suggestion..."
                                        className="
                                            w-full
                                            px-4
                                            py-3
                                            text-sm
                                            text-gray-700
                                            bg-white
                                            border
                                            border-transparent
                                            rounded-xl
                                            outline-none
                                            resize-none
                                            focus:ring-2
                                            focus:ring-white/50
                                        "
                                    />

                                    <div className="flex justify-end mt-4">

                                        <button
                                            type="button"
                                            className="
                                                px-5
                                                py-2.5
                                                text-sm
                                                font-semibold
                                                text-blue-700
                                                bg-white
                                                rounded-lg
                                                hover:bg-blue-50
                                                transition
                                            "
                                            onClick={handleSubmitSuggestion}
                                        >
                                            Submit Suggestion
                                        </button>

                                    </div>

                                </div>

                            </div>
                        )}

                    </div>

                    </div>
                </div>
                
            </div>
        </div>
    );
};

export default Dashboard;