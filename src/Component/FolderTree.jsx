import React, { useState } from "react";
import { useUser } from "../Pages/Auth/UserContext";
import {
    FolderIcon,
    ChevronRightIcon,
    ChevronDownIcon,
    PlusIcon,
    PencilIcon,
    TrashIcon,
} from "@heroicons/react/24/solid";
const FolderNode = ({
    folder,
    level = 0,
    onFolderClick,
    onAddFolder,
    onEditFolder,
    onDeleteFolder,
}) => {

    const [expanded, setExpanded] = useState(true);
    const { user } = useUser();
    return (
        <div>
            <div
                className="group flex items-center justify-between rounded-lg px-2 py-2 hover:bg-gray-100"
                style={{
                    paddingLeft: `${level * 22 + 8}px`
                }}
            >
                {/* LEFT */}
                <div
                    className="flex cursor-pointer items-center gap-2"
                    onClick={() => onFolderClick(folder)}
                >
                    {folder.children.length > 0 ? (
                        expanded ?
                            <ChevronDownIcon
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setExpanded(false);
                                }}
                                className="h-4 w-4 text-gray-500"
                            />
                        :
                            <ChevronRightIcon
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setExpanded(true);
                                }}
                                className="h-4 w-4 text-gray-500"
                            />
                    ) : (
                        <div className="w-4"/>
                    )}
                    <FolderIcon className="h-5 w-5 text-yellow-500"/>
                    <span className="text-sm">
                        {folder.title}
                    </span>
                </div>
                {/* RIGHT */}
                {["RTA", "SCHEDULER", "RA", "ADMIN"].includes(user?.permission) && (
                    <div className="hidden gap-1 group-hover:flex">
                        <button
                            onClick={() => onAddFolder(folder)}
                            className="rounded p-1 hover:bg-green-100"
                        >
                            <PlusIcon className="h-4 w-4 text-green-600"/>
                        </button>
                        <button
                            onClick={() => onEditFolder(folder)}
                            className="rounded p-1 hover:bg-blue-100"
                        >
                            <PencilIcon className="h-4 w-4 text-blue-600"/>
                        </button>
                        <button
                            onClick={() => onDeleteFolder(folder)}
                            className="rounded p-1 hover:bg-red-100"
                        >
                            <TrashIcon className="h-4 w-4 text-red-600"/>
                        </button>
                    </div>
                )}
            </div>
            {expanded && folder.children.map(child => (
                <FolderNode
                    key={child.id}
                    folder={child}
                    level={level + 1}
                    onFolderClick={onFolderClick}
                    onAddFolder={onAddFolder}
                    onEditFolder={onEditFolder}
                    onDeleteFolder={onDeleteFolder}
                />
            ))}
        </div>
    );
};

const FolderTree = ({
    folders = [],
    onFolderClick,
    onAddFolder,
    onEditFolder,
    onDeleteFolder,
}) => {

    const buildTree = (folders, parentId = null) => {
        return folders
            .filter(folder => folder.parent_id === parentId)
            .map(folder => ({
                ...folder,
                children: buildTree(folders, folder.id)
            }));
    };

    const tree = buildTree(folders);
    return (
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">

            <div className="border-b px-5 py-3">
                <h2 className="text-lg font-semibold">
                    Folders
                </h2>
            </div>
            <div className="p-3 max-h-[500px] overflow-y-auto">
                {folders.length === 0 ? (
                    <div className="text-sm text-gray-500">
                        No folders found.
                    </div>
                ) : (
                    tree.map(folder => (
                        <FolderNode
                            key={folder.id}
                            folder={folder}
                            onFolderClick={onFolderClick}
                            onAddFolder={onAddFolder}
                            onEditFolder={onEditFolder}
                            onDeleteFolder={onDeleteFolder}
                        />
                    ))
                )}
            </div>
        </div>
    );
};

export default FolderTree;