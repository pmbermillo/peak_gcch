import { forwardRef, useImperativeHandle, useState, useEffect } from "react";
import {
    XMarkIcon,
    PaperAirplaneIcon,
    FolderIcon,
    LinkIcon,
} from "@heroicons/react/24/solid";

const LinkForm = forwardRef(({
    category,
    showFolder = true,
    mode = null,
    initialData = {
        title: "",
        link: "",
        remarks: "",
    },
    parentId = null,
    onSubmit,
    onCancel,
    loading = false,
}, ref) => {

    const [currentMode, setCurrentMode] = useState(mode);
    // const currentMode = showFolder ? mode : "link";
    const [folderName, setFolderName] = useState("");

    const [form, setForm] = useState({
        title: initialData.title || "",
        link: initialData.link || "",
        remarks: initialData.remarks || "",
    });

    useEffect(() => {
        setForm({
            title: initialData.title || "",
            link: initialData.link || "",
            remarks: initialData.remarks || "",
        });
    }, [
        initialData.id,
        initialData.title,
        initialData.link,
        initialData.remarks,
    ]);

    const resetForm = () => {
        setFolderName("");

        setForm({
            title: "",
            link: "",
            remarks: "",
        });

        setCurrentMode(null);
    };

    useImperativeHandle(ref, () => ({
        clearForm() {
            resetForm();
        },
    }));

    const handleSubmit = (e) => {
        e.preventDefault();

        onSubmit?.({
            id: initialData.id,
            category,
            parent_id: parentId,
            ...form,
        });

        resetForm();
    };

    const handleFolderSubmit = (e) => {
        e.preventDefault();
        console.log({
            category,
            title: folderName,
            type: "folder",
            parent_id: parentId,
        });
        onSubmit?.({
            id: initialData.id,
            category,
            title: folderName,
            type: "folder",
             parent_id: initialData.id
                ? initialData.parent_id   // Editing: preserve existing parent
                : parentId,  
        });

        resetForm();
    };

    const handleCancel = () => {
        resetForm();
        onCancel?.();
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    useEffect(() => {
        setCurrentMode(mode);
    }, [mode]);

    useEffect(() => {
        if (currentMode === "folder") {
            setFolderName(initialData.title || "");
        }
    }, [initialData, currentMode]);

    return (
        <>
        {showFolder && (
            <div className="mb-4">
                <button
                    type="button"
                    onClick={() => {setCurrentMode("folder")}}
                    className={`flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition
                        ${
                            currentMode === "folder"
                                ? "bg-black text-white"
                                : "border-gray-300 bg-white hover:bg-gray-100"
                        }`}
                >
                    <FolderIcon className="h-5 w-5" />
                    New Folder
                </button>
            </div>
        )}
        
        {(!showFolder || currentMode) && (
            <div className="w-full max-w-5xl rounded-xl border border-gray-200 bg-white shadow-sm">
                {/* Header */}
                <div className="border-b border-gray-100 px-5 py-3">
                    <h3 className="text-base font-semibold text-gray-800">
                        {currentMode === "folder"
                            ? "Create Folder"
                            : "Create Link"}
                    </h3>
                    <p className="mt-1 text-xs text-gray-500">
                        {currentMode === "folder"
                            ? "Create a folder to organize your links."
                            : "Create and submit a new link."}
                    </p>
                </div>
                {/* Folder Form */}
                {currentMode === "folder" && (
                    <form
                        onSubmit={handleFolderSubmit}
                        className="space-y-5 p-5"
                    >
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div>
                                <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-gray-500">
                                    Category
                                </label>
                                <input
                                    type="text"
                                    disabled
                                    value={category || ""}
                                    className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm"
                                />
                            </div>
                            <div>
                                <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-gray-500">
                                    Folder Name
                                </label>
                                <input
                                    required
                                    type="text"
                                    value={folderName}
                                    onChange={(e) =>
                                        setFolderName(e.target.value)
                                    }
                                    placeholder="Enter folder name"
                                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-black"
                                />
                            </div>
                        </div>
                        <div className="flex justify-end gap-2">
                            <button
                                type="button"
                                onClick={handleCancel}
                                className="flex items-center gap-1 rounded-lg border border-gray-300 px-4 py-2 text-xs font-medium text-gray-700 hover:bg-gray-100"
                            >
                                <XMarkIcon className="h-4 w-4" />
                                Cancel
                            </button>

                            <button
                                type="submit"
                                disabled={!folderName.trim()}
                                className="flex items-center gap-1 rounded-lg bg-black px-4 py-2 text-xs font-medium text-white disabled:opacity-50"
                            >
                                <PaperAirplaneIcon className="h-4 w-4" />
                                Submit
                            </button>
                        </div>
                    </form>
                )}
                {/* PART 2 STARTS HERE */}
                {(!showFolder || currentMode  === "link") && (
                    <form onSubmit={handleSubmit} className="space-y-5 p-5">
                        {/* Top Fields */}
                        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[170px_240px_1fr]">

                            {/* Category */}
                            <div>
                                <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-gray-500">
                                    Category
                                </label>

                                <input
                                    type="text"
                                    value={category || ""}
                                    disabled
                                    className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-600 outline-none"
                                />
                            </div>

                            {/* Title */}
                            <div>
                                <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-gray-500">
                                    Title
                                </label>

                                <input
                                    required
                                    type="text"
                                    name="title"
                                    value={form.title}
                                    onChange={handleChange}
                                    placeholder="Enter title"
                                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none transition focus:border-black"
                                />
                            </div>

                            {/* Link */}
                            <div>
                                <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-gray-500">
                                    Link
                                </label>

                                <input
                                    required
                                    type="url"
                                    name="link"
                                    value={form.link}
                                    onChange={handleChange}
                                    placeholder="https://example.com"
                                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none transition focus:border-black"
                                />
                            </div>

                        </div>
                        {/* Remarks */}
                        <div>
                            <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-gray-500">
                                Remarks
                            </label>

                            <textarea
                                name="remarks"
                                value={form.remarks}
                                onChange={handleChange}
                                rows={3}
                                placeholder="Additional remarks (optional)"
                                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none transition focus:border-black"
                            />
                        </div>
                        {/* Buttons */}
                        <div className="flex justify-end gap-2">

                            <button
                                type="button"
                                onClick={handleCancel}
                                className="flex items-center gap-1 rounded-lg border border-gray-300 px-4 py-2 text-xs font-medium text-gray-700 transition hover:bg-gray-100"
                            >
                                <XMarkIcon className="h-4 w-4" />
                                Cancel
                            </button>

                            <button
                                type="submit"
                                disabled={loading}
                                className="flex items-center gap-1 rounded-lg bg-black px-4 py-2 text-xs font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                <PaperAirplaneIcon className="h-4 w-4" />
                                {loading ? "Submitting..." : "Submit"}
                            </button>

                        </div>
                    </form>
                )}
            </div>
        )}

        </>
    );
});

export default LinkForm;