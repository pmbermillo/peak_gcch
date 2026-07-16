import { forwardRef, useImperativeHandle, useState, useEffect } from "react";
import { XMarkIcon, PaperAirplaneIcon } from "@heroicons/react/24/solid"; 

const LinkForm = forwardRef(({
        category,
        initialData = {
            title: '',
            link: '',
            remarks: '',
        },
        onSubmit,
        onCancel,
        loading = false,
    }, ref) => {

    const [form, setForm] = useState({
        title: initialData.title || '',
        link: initialData.link || '',
        remarks: initialData.remarks || '',
    });

    useEffect(() => {
        setForm({
            title: initialData.title || '',
            link: initialData.link || '',
            remarks: initialData.remarks || '',
        });
    }, [
        initialData.id,
        initialData.title,
        initialData.link,
        initialData.remarks
    ]);

    useImperativeHandle(ref, () => ({
        clearForm: () => {
            setForm({
                title: '',
                link: '',
                remarks: '',
            });
        }
    }));

    const handleSubmit = (e) => {
        e.preventDefault();

        onSubmit?.({
            id: initialData.id, // Pass ID for updates, undefined for new entries
            category,
            ...form,
        });
    };

    const handleCancel = () => {
        onCancel?.();
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        setForm((prev) => ({
        ...prev,
        [name]: value,
        }));
    };

    return (
        <div className="w-full max-w-5xl rounded-xl border border-gray-200 bg-white shadow-sm">
            {/* Header */}
            <div className="border-b border-gray-100 px-5 py-2">
                <h3 className="text-base font-semibold tracking-wide text-gray-800">
                    ADD LINK
                </h3>

                <p className="mt-1 text-xs text-gray-500">
                    Create and submit a new link
                </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5 p-2">
                
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

                {/* Bottom Section */}
                <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                    
                    {/* Remarks */}
                    <div className="flex-1">
                        <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-gray-500">
                            Remarks
                        </label>

                        <textarea
                            name="remarks"
                            value={form.remarks || ""}
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
                            <XMarkIcon className="h-4 w-4" /> Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={loading}
                            className="flex items-center gap-1 rounded-lg bg-black px-4 py-2 text-xs font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <PaperAirplaneIcon className="h-4 w-4" />{loading ? "Submitting..." : "Submit"}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    )
});

export default LinkForm