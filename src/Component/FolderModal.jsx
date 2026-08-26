const FolderModal = ({
    open,
    folder,
    children,
    onClose
}) => {

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="w-[90%] max-w-7xl rounded-xl bg-white shadow-xl">
                <div className="flex items-center justify-between border-b px-6 py-4">
                    <h2 className="text-lg font-semibold">
                        📁 {folder?.title}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-xl"
                    >
                        ✕
                    </button>
                </div>
                <div className="p-5">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default FolderModal;