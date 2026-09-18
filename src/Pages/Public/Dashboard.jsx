import React, { useEffect, useState } from 'react';
import { GetNotifications } from '../../Api/Module/DashboardApi.jsx';

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

    const alerts = notifications.filter(
        notification => notification.type === 'alert'
    );

    const announcements = notifications.filter(
        notification => notification.type === 'announcement'
    );

    const news = notifications.filter(
        notification => notification.type === 'news'
    );

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

    return (
        <div className="min-h-screen bg-gray-50 px-4 py-6">
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
                    ALERTS + ANNOUNCEMENTS
                ====================================================== */}
                {/* <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div
                        className="
                            bg-white
                            rounded-2xl
                            border
                            border-gray-200
                            shadow-sm
                            overflow-hidden
                        "
                    >
                        <div className="p-5 border-b border-gray-100">

                            <div className="flex items-center justify-between">

                                <div className="flex items-center gap-3">

                                    <div
                                        className="
                                            w-10
                                            h-10
                                            flex
                                            items-center
                                            justify-center
                                            bg-red-50
                                            rounded-xl
                                        "
                                    >
                                        🔔
                                    </div>
                                    <div>

                                        <h2 className="font-bold text-gray-800">
                                            My Alerts
                                        </h2>

                                        <p className="text-xs text-gray-500">
                                            Items that need your attention
                                        </p>

                                    </div>
                                </div>
                                <span
                                    className="
                                        px-2.5
                                        py-1
                                        text-xs
                                        font-bold
                                        text-red-600
                                        bg-red-50
                                        rounded-full
                                    "
                                >
                                    3
                                </span>
                            </div>
                        </div>
                        <div className="divide-y divide-gray-100">

                            <div className="p-4 flex gap-3 hover:bg-gray-50 transition cursor-pointer">

                                <span className="text-lg">
                                    ⚠️
                                </span>

                                <div className="flex-1">

                                    <p className="text-sm font-semibold text-gray-700">
                                        Accreditation expires in 5 days
                                    </p>

                                    <p className="text-xs text-gray-400 mt-1">
                                        Please renew your accreditation.
                                    </p>

                                </div>

                            </div>


                            <div className="p-4 flex gap-3 hover:bg-gray-50 transition cursor-pointer">

                                <span className="text-lg">
                                    📄
                                </span>

                                <div className="flex-1">

                                    <p className="text-sm font-semibold text-gray-700">
                                        Document requires your approval
                                    </p>

                                    <p className="text-xs text-gray-400 mt-1">
                                        Submitted 1 hour ago.
                                    </p>

                                </div>

                            </div>


                            <div className="p-4 flex gap-3 hover:bg-gray-50 transition cursor-pointer">

                                <span className="text-lg">
                                    📝
                                </span>

                                <div className="flex-1">

                                    <p className="text-sm font-semibold text-gray-700">
                                        You have 2 pending requests
                                    </p>

                                    <p className="text-xs text-gray-400 mt-1">
                                        Review your pending requests.
                                    </p>

                                </div>

                            </div>

                        </div>


                        <div className="p-4">

                            <button
                                type="button"
                                className="
                                    text-sm
                                    font-semibold
                                    text-blue-600
                                    hover:text-blue-700
                                "
                            >
                                View all alerts →
                            </button>

                        </div>

                    </div>

                    <div
                        className="
                            bg-white
                            rounded-2xl
                            border
                            border-gray-200
                            shadow-sm
                            overflow-hidden
                        "
                    >

                        <div className="p-5 border-b border-gray-100">

                            <div className="flex items-center gap-3">

                                <div
                                    className="
                                        w-10
                                        h-10
                                        flex
                                        items-center
                                        justify-center
                                        bg-blue-50
                                        rounded-xl
                                    "
                                >
                                    📢
                                </div>

                                <div>

                                    <h2 className="font-bold text-gray-800">
                                        Announcements
                                    </h2>

                                    <p className="text-xs text-gray-500">
                                        Important organization updates
                                    </p>

                                </div>

                            </div>

                        </div>


                        <div className="divide-y divide-gray-100">

                            <div className="p-4 hover:bg-gray-50 transition cursor-pointer">

                                <div className="flex items-start gap-3">

                                    <span className="px-2 py-1 text-[10px] font-bold text-red-600 bg-red-50 rounded-full">
                                        URGENT
                                    </span>

                                    <div className="flex-1">

                                        <h3 className="text-sm font-semibold text-gray-700">
                                            System Maintenance
                                        </h3>

                                        <p className="text-xs text-gray-400 mt-1">
                                            Scheduled August 20, 10:00 PM.
                                        </p>

                                    </div>

                                </div>

                            </div>


                            <div className="p-4 hover:bg-gray-50 transition cursor-pointer">

                                <div className="flex items-start gap-3">

                                    <span className="px-2 py-1 text-[10px] font-bold text-yellow-600 bg-yellow-50 rounded-full">
                                        IMPORTANT
                                    </span>

                                    <div className="flex-1">

                                        <h3 className="text-sm font-semibold text-gray-700">
                                            New HR Policy
                                        </h3>

                                        <p className="text-xs text-gray-400 mt-1">
                                            Effective August 25.
                                        </p>

                                    </div>

                                </div>

                            </div>


                            <div className="p-4 hover:bg-gray-50 transition cursor-pointer">

                                <div className="flex items-start gap-3">

                                    <span className="px-2 py-1 text-[10px] font-bold text-blue-600 bg-blue-50 rounded-full">
                                        GENERAL
                                    </span>

                                    <div className="flex-1">

                                        <h3 className="text-sm font-semibold text-gray-700">
                                            Office Holiday Schedule
                                        </h3>

                                        <p className="text-xs text-gray-400 mt-1">
                                            Posted August 15.
                                        </p>

                                    </div>

                                </div>

                            </div>

                        </div>


                        <div className="p-4">

                            <button
                                type="button"
                                className="
                                    text-sm
                                    font-semibold
                                    text-blue-600
                                    hover:text-blue-700
                                "
                            >
                                View all announcements →
                            </button>

                        </div>

                    </div>

                </div> */}

                {/* =====================================================
                    NEWS + SUGGESTION
                ====================================================== */}
                {/* <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div
                        className="
                            bg-white
                            rounded-2xl
                            border
                            border-gray-200
                            shadow-sm
                            overflow-hidden
                        "
                    >
                        <div className="p-5 border-b border-gray-100">
                            <div className="flex items-center gap-3">
                                <div
                                    className="
                                        w-10
                                        h-10
                                        flex
                                        items-center
                                        justify-center
                                        bg-indigo-50
                                        rounded-xl
                                    "
                                >
                                    📰
                                </div>
                                <div>
                                    <h2 className="font-bold text-gray-800">
                                        News Feed
                                    </h2>
                                    <p className="text-xs text-gray-500">
                                        Latest news and updates
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="divide-y divide-gray-100">
                            <div className="p-4 hover:bg-gray-50 transition cursor-pointer">
                                <div className="flex gap-4">
                                    <div
                                        className="
                                            w-12
                                            h-12
                                            flex-shrink-0
                                            flex
                                            items-center
                                            justify-center
                                            bg-blue-50
                                            rounded-xl
                                            text-xl
                                        "
                                    >
                                        🎉
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-semibold text-gray-700">
                                            New Employee Benefits Program
                                        </h3>
                                        <p className="text-xs text-gray-400 mt-1">
                                            Learn about the new employee benefits program.
                                        </p>
                                        <p className="text-[11px] text-gray-400 mt-2">
                                            2 hours ago
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="p-4 hover:bg-gray-50 transition cursor-pointer">
                                <div className="flex gap-4">
                                    <div
                                        className="
                                            w-12
                                            h-12
                                            flex-shrink-0
                                            flex
                                            items-center
                                            justify-center
                                            bg-purple-50
                                            rounded-xl
                                            text-xl
                                        "
                                    >
                                        📚
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-semibold text-gray-700">
                                            New Training Schedule
                                        </h3>
                                        <p className="text-xs text-gray-400 mt-1">
                                            August training sessions are now available.
                                        </p>
                                        <p className="text-[11px] text-gray-400 mt-2">
                                            Yesterday
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="p-4 hover:bg-gray-50 transition cursor-pointer">
                                <div className="flex gap-4">
                                    <div
                                        className="
                                            w-12
                                            h-12
                                            flex-shrink-0
                                            flex
                                            items-center
                                            justify-center
                                            bg-yellow-50
                                            rounded-xl
                                            text-xl
                                        "
                                    >
                                        🏆
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-semibold text-gray-700">
                                            Congratulations to our Top Performers!
                                        </h3>
                                        <p className="text-xs text-gray-400 mt-1">
                                            Celebrating our outstanding employees.
                                        </p>
                                        <p className="text-[11px] text-gray-400 mt-2">
                                            3 days ago
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="p-4">
                            <button
                                type="button"
                                className="
                                    text-sm
                                    font-semibold
                                    text-indigo-600
                                    hover:text-indigo-700
                                "
                            >
                                View all news →
                            </button>
                        </div>
                    </div>
                    <div
                        className="
                            bg-gradient-to-br
                            from-indigo-600
                            to-blue-700
                            rounded-2xl
                            shadow-sm
                            p-6
                            text-white
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
                        <p className="text-sm text-blue-50 mb-5">
                            Have an idea, suggestion, or improvement
                            you'd like to share? Let us know.
                        </p>
                        <textarea
                            rows="5"
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
                            >
                                Submit Suggestion
                            </button>
                        </div>
                    </div>
                </div> */}
            </div>
        </div>
    );
};

export default Dashboard;