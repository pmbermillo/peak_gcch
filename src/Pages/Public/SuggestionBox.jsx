import React, { useState, useEffect} from 'react'
import { toast } from 'react-toastify';
import Table from '../../Component/Table.jsx';
import { GetSuggestions, UpdateSuggestion } from '../../Api/Module/DashboardApi.jsx'
import {format} from 'date-fns';

const SuggestionBox = () => {
    const [data, setData] = useState([]);
    const [editingCell, setEditingCell] = useState(null);
    const [editValue, setEditValue] = useState("");
    const [suggestions, setSuggestions] = useState([]);

    const handleEdit = (row, field, value) => {
        setEditingCell({
            id: row.id,
            field,
            originalValue: value ?? "",
        });

        setEditValue(value ?? "");
    };

    const handleSave = async () => {
        if (!editingCell) return;

        const { id, field, originalValue } = editingCell;
        const value = editValue;

        setEditingCell(null);

        if (String(value) === String(originalValue ?? "")) return;

        const payload = {
            id,
            status: field === "status" ? value : undefined,
            admin_notes: field === "admin_notes" ? value : undefined,
        };
        console.log("Updating suggestion with payload:", payload);
        // Send only the fields needed for the update.
        try {
            const response = await UpdateSuggestion({
                id: payload.id,
                ...(field === "status" && { status: value }),
                ...(field === "admin_notes" && { admin_notes: value }),
            });
            console.log("Suggestion updated successfully:", response);
            toast.success(response.data.message);

            setSuggestions((prev) =>
                prev.map((item) =>
                    item.id === id
                        ? {
                            ...item,
                            [field]: value,
                        }
                        : item
                )
            );

            await fetchData(); // Refresh the data after update
        } catch (error) {
            console.log(error);

            toast.error(
                error.response?.data?.errors?.status?.[0] ??
                error.response?.data?.errors?.remarks?.[0] ??
                error.response?.data?.error ??
                'Failed to update suggestion.'
            );
        }
    };

    const cols = [
        { header: 'ID', accessor: 'id' },
        {
            header: "Status",
            accessor: "status",
            renderCell: (value, row) => {
                const isEditing =
                    editingCell?.id === row.id &&
                    editingCell?.field === "status";

                const statusStyles = {
                    "Pending": "bg-amber-50 text-amber-700 border-amber-200",
                    "In Progress": "bg-blue-50 text-blue-700 border-blue-200",
                    "Rejected": "bg-red-50 text-red-700 border-red-200",
                    "Completed": "bg-green-50 text-green-700 border-green-200",
                };

                return isEditing ? (
                    <select
                        autoFocus
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onBlur={handleSave}
                        className="w-full min-w-32 rounded-lg border-2 border-blue-400 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm outline-none focus:ring-2 focus:ring-blue-100"
                    >
                        <option value="Pending">Pending</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Rejected">Rejected</option>
                        <option value="Completed">Completed</option>
                    </select>
                ) : (
                    <button
                        type="button"
                        onClick={() => handleEdit(row, "status", value)}
                        title="Click to edit status"
                        className={`group inline-flex min-w-32 items-center justify-between gap-3 rounded-lg border px-3 py-2 text-sm font-semibold transition hover:border-blue-400 hover:shadow-sm ${
                            statusStyles[value] ||
                            "border-gray-300 bg-gray-50 text-gray-700"
                        }`}
                    >
                        <span>{value || "Select status"}</span>
                        <svg
                            className="h-4 w-4 shrink-0 opacity-60 group-hover:opacity-100"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={1.8}
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M16.862 4.487l2.651 2.651M7.5 16.5l-3 1 1-3L16.5 3.5a2.121 2.121 0 013 3L7.5 16.5z"
                            />
                        </svg>
                    </button>
                );
            },
        },
        {
            header: "Remarks",
            accessor: "admin_notes",
            renderCell: (value, row) => {
                const isEditing =
                    editingCell?.id === row.id &&
                    editingCell?.field === "admin_notes";

                return isEditing ? (
                    <input
                        autoFocus
                        type="text"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onBlur={handleSave}
                        placeholder="Enter remarks..."
                        className="w-full min-w-48 rounded-lg border-2 border-blue-400 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm outline-none placeholder:text-gray-400 focus:ring-2 focus:ring-blue-100"
                    />
                ) : (
                    <button
                        type="button"
                        onClick={() =>
                            handleEdit(row, "admin_notes", value)
                        }
                        title="Click to edit remarks"
                        className="group flex w-full min-w-48 items-center justify-between gap-3 rounded-lg border border-dashed border-gray-300 bg-gray-50 px-3 py-2 text-left text-sm transition hover:border-blue-400 hover:bg-blue-50"
                    >
                        <span
                            className={`min-w-0 flex-1 break-words ${
                                value
                                    ? "text-gray-700"
                                    : "italic text-gray-400"
                            }`}
                        >
                            {value || "Click to add remarks"}
                        </span>
                        <svg
                            className="h-4 w-4 shrink-0 text-gray-400 group-hover:text-blue-600"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={1.8}
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M16.862 4.487l2.651 2.651M7.5 16.5l-3 1 1-3L16.5 3.5a2.121 2.121 0 013 3L7.5 16.5z"
                            />
                        </svg>
                    </button>
                );
            },
        },
        { header: 'Suggestion', accessor: 'suggestion' },
        { header: 'Submitted By', accessor: 'name' },
        { header: 'Employee ID', accessor: 'employee_id' },
        { header: 'Date Submitted', accessor: 'created_at', renderCell: (value) => value ? format(new Date(value), "yyyy-MM-dd HH:mm"):""  },
    ];

    const fetchData = async () => {
        try {
            const response = await GetSuggestions();
            console.log('Suggestions fetched successfully:', response);
            if (response.data.status == 'success') {
                setData(response.data[0]);
            }
        } catch (error) {
            toast.error('Failed to fetch suggestions');
        }
    }

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div>
            <Table
                title="Suggestion Box"
                columns={cols}
                data={data}
            />
        </div>
    )
}

export default SuggestionBox