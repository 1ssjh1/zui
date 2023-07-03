export type UploadOptions = {
    name: string;
} & Partial<{
    icon: string;
    showIcon: boolean;
    showSize: boolean;
    multiple: boolean;
    listPosition: 'bottom' | 'top';
    uploadText: string;
    renameBtn: boolean;
    renameIcon: string;
    renameText: string;
    renameClass: string;
    deleteBtn: boolean;
    deleteIcon: string;
    deleteText: string;
    deleteClass: string;
    confirmText: string;
    cancelText: string;
    useIconBtn: boolean;
    tip: string;
    btnClass: string;
    onAdd: (files: File[] | File) => void;
    onDelete: (file: File) => void;
    onRename: (newName: string, oldName: string) => void;
    onSizeChange: (size: number) => void;
    draggable: boolean;
    limitCount: number;
    accept: string;
    defaultFileList: File[];
    limitSize: `${number}${'B' | 'KB' | 'MB' | 'GB'}` | false;
    duplicatedHint: string;
    exceededSizeHint: string;
    exceededCountHint: string;
}>;
