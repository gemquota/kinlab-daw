import { useState, useMemo, useCallback } from "react";
import { cn } from "@/lib/cn";
import {
  Folder,
  FolderOpen,
  File,
  FileCode2,
  FileText,
  FileType,
  ChevronRight,
  ChevronDown,
  FolderTree,
  LayoutList,
  Search,
  X,
} from "lucide-react";
import {
  PROJECT_FILES,
  flattenFiles,
  countFiles,
  countFolders,
  formatSize,
  extLabel,
  type FileNode,
} from "@/data/files.data";

/* ── icon pickers ──────────────────────────────────────────────────── */

function fileIcon(ext?: string) {
  switch (ext) {
    case "ts":
    case "tsx":
      return FileCode2;
    case "css":
      return FileType;
    case "md":
      return FileText;
    default:
      return File;
  }
}

const FOLDER_COLORS = [
  "text-derivative-position-500",
  "text-derivative-velocity-500",
  "text-derivative-acceleration-500",
  "text-derivative-jerk-500",
  "text-derivative-snap-500",
] as const;

function folderIconColor(depth: number): string {
  return FOLDER_COLORS[depth % FOLDER_COLORS.length] as string;
}

/* ── tree node row ─────────────────────────────────────────────────── */

interface TreeNodeProps {
  node: FileNode;
  depth: number;
  searchQuery: string;
  onFileSelect: (node: FileNode) => void;
  selectedPath: string | null;
}

function TreeNode({ node, depth, searchQuery, onFileSelect, selectedPath }: TreeNodeProps) {
  const [open, setOpen] = useState(depth < 1); // auto-expand root
  const isFolder = node.type === "folder";

  const matchesSearch =
    searchQuery === "" ||
    node.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    node.path.toLowerCase().includes(searchQuery.toLowerCase());

  // if searching and this is a folder, check if any descendant matches
  const hasMatchingDescendant = useMemo(() => {
    if (searchQuery === "") return true;
    if (matchesSearch) return true;
    if (!isFolder) return false;
    return (node.children ?? []).some(function hasMatch(n: FileNode): boolean {
      if (n.name.toLowerCase().includes(searchQuery.toLowerCase())) return true;
      return (n.children ?? []).some(hasMatch);
    });
  }, [searchQuery, node, isFolder, matchesSearch]);

  if (!hasMatchingDescendant && searchQuery !== "") return null;

  const isSelected = selectedPath === node.path;

  const handleClick = useCallback(() => {
    if (isFolder) {
      setOpen((o) => !o);
    } else {
      onFileSelect(node);
    }
  }, [isFolder, node, onFileSelect]);

  const Icon = isFolder ? (open ? FolderOpen : Folder) : fileIcon(node.ext);
  const colorClass = isFolder ? folderIconColor(depth) : "text-text-tertiary";

  return (
    <div>
      <button
        onClick={handleClick}
        className={cn(
          "w-full flex items-center gap-1.5 py-1 px-2 rounded-md text-sm transition-colors",
          "hover:bg-surface-tertiary",
          isSelected && "bg-derivative-position-500/10 text-derivative-position-500",
          !isSelected && "text-text-primary",
        )}
        style={{ paddingLeft: `${depth * 16 + 8}px` }}
        aria-expanded={isFolder ? open : undefined}
      >
        {/* chevron for folders */}
        {isFolder ? (
          open ? (
            <ChevronDown className="w-3.5 h-3.5 shrink-0 text-text-tertiary" />
          ) : (
            <ChevronRight className="w-3.5 h-3.5 shrink-0 text-text-tertiary" />
          )
        ) : (
          <span className="w-3.5 h-3.5 shrink-0" />
        )}

        <Icon className={cn("w-4 h-4 shrink-0", colorClass)} />

        <span className="truncate font-medium">{node.name}</span>

        {isFolder && (
          <span className="ml-auto text-mono text-text-tertiary text-[11px]">
            {countFiles(node)} files
          </span>
        )}

        {!isFolder && node.size !== undefined && (
          <span className="ml-auto text-mono text-text-tertiary text-[11px]">
            {formatSize(node.size)}
          </span>
        )}
      </button>

      {isFolder && open && (
        <div>
          {(node.children ?? [])
            .sort((a, b) => {
              // folders first, then alphabetical
              if (a.type !== b.type) return a.type === "folder" ? -1 : 1;
              return a.name.localeCompare(b.name);
            })
            .map((child) => (
              <TreeNode
                key={child.path}
                node={child}
                depth={depth + 1}
                searchQuery={searchQuery}
                onFileSelect={onFileSelect}
                selectedPath={selectedPath}
              />
            ))}
        </div>
      )}
    </div>
  );
}

/* ── flat list row ─────────────────────────────────────────────────── */

interface FlatRowProps {
  node: FileNode;
  onFileSelect: (n: FileNode) => void;
  selectedPath: string | null;
}

function FlatRow({ node, onFileSelect, selectedPath }: FlatRowProps) {
  const Icon = fileIcon(node.ext);
  const isSelected = selectedPath === node.path;

  return (
    <button
      onClick={() => onFileSelect(node)}
      className={cn(
        "w-full flex items-center gap-2.5 py-2 px-3 rounded-lg text-sm transition-colors",
        "hover:bg-surface-tertiary",
        isSelected && "bg-derivative-position-500/10 text-derivative-position-500",
        !isSelected && "text-text-primary",
      )}
    >
      <Icon className="w-4 h-4 shrink-0 text-text-tertiary" />
      <span className="font-medium truncate flex-1 text-left">{node.name}</span>
      <span className="text-mono text-text-tertiary text-[11px] shrink-0">
        {extLabel(node.ext)}
      </span>
      <span className="text-mono text-text-tertiary text-[11px] shrink-0 w-16 text-right">
        {node.size !== undefined ? formatSize(node.size) : "—"}
      </span>
    </button>
  );
}

/* ── file detail panel ─────────────────────────────────────────────── */

function FileDetail({ node }: { node: FileNode }) {
  return (
    <div className="p-4 bg-surface-tertiary rounded-lg space-y-3">
      <div className="flex items-center gap-2">
        {(() => {
          const Icon = fileIcon(node.ext);
          return <Icon className="w-5 h-5 text-derivative-position-500" />;
        })()}
        <span className="font-semibold text-text-primary">{node.name}</span>
      </div>
      <div className="grid grid-cols-2 gap-2 text-caption">
        <Detail label="Path" value={node.path} />
        <Detail label="Type" value={extLabel(node.ext)} />
        <Detail label="Size" value={node.size !== undefined ? formatSize(node.size) : "—"} />
      </div>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col">
      <span className="text-text-tertiary">{label}</span>
      <span className="font-mono text-text-primary truncate">{value}</span>
    </div>
  );
}

/* ── main component ────────────────────────────────────────────────── */

export function FileExplorer() {
  const [mode, setMode] = useState<"tree" | "flat">("tree");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFile, setSelectedFile] = useState<FileNode | null>(null);

  const allFiles = useMemo(() => flattenFiles(PROJECT_FILES), []);

  const filteredFiles = useMemo(() => {
    if (searchQuery === "") return allFiles;
    const q = searchQuery.toLowerCase();
    return allFiles.filter(
      (f) => f.name.toLowerCase().includes(q) || f.path.toLowerCase().includes(q),
    );
  }, [allFiles, searchQuery]);

  const totalFiles = countFiles(PROJECT_FILES);
  const totalFolders = countFolders(PROJECT_FILES);

  return (
    <div className="bg-surface-secondary border border-border-subtle rounded-xl overflow-hidden flex flex-col">
      {/* Header */}
      <div className="px-4 py-3 border-b border-border-subtle flex items-center gap-3 flex-wrap">
        <h3 className="text-body font-semibold text-text-primary shrink-0">
          Project Files
        </h3>

        {/* stats */}
        <span className="text-mono text-text-tertiary text-[11px]">
          {totalFiles} files · {totalFolders} folders
        </span>

        {/* search */}
        <div className="relative ml-auto flex items-center">
          <Search className="absolute left-2 w-3.5 h-3.5 text-text-tertiary pointer-events-none" />
          <input
            aria-label="Filter files"
            type="text"
            placeholder="Filter…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-7 pr-6 py-1.5 text-sm bg-surface-tertiary border border-border-subtle rounded-lg text-text-primary placeholder:text-text-tertiary focus:border-border-accent focus:outline-none w-44"
          />
          {searchQuery !== "" && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-1.5 p-0.5 rounded hover:bg-surface-secondary text-text-tertiary"
              aria-label="Clear filter"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* mode toggle */}
        <div className="flex items-center bg-surface-tertiary rounded-lg p-0.5" role="tablist" aria-label="View mode">
          <button
            role="tab"
            aria-selected={mode === "tree"}
            onClick={() => setMode("tree")}
            title="Folder tree"
            className={cn(
              "flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors",
              mode === "tree"
                ? "bg-surface-primary text-text-primary shadow-sm"
                : "text-text-tertiary hover:text-text-secondary",
            )}
          >
            <FolderTree className="w-3.5 h-3.5" />
            Tree
          </button>
          <button
            role="tab"
            aria-selected={mode === "flat"}
            onClick={() => setMode("flat")}
            title="Flat list"
            className={cn(
              "flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors",
              mode === "flat"
                ? "bg-surface-primary text-text-primary shadow-sm"
                : "text-text-tertiary hover:text-text-secondary",
            )}
          >
            <LayoutList className="w-3.5 h-3.5" />
            Flat
          </button>
        </div>
      </div>

      {/* body */}
      <div className="flex-1 overflow-y-auto max-h-[480px] p-2 space-y-0.5">
        {mode === "tree" ? (
          <TreeNode
            node={PROJECT_FILES}
            depth={0}
            searchQuery={searchQuery}
            onFileSelect={setSelectedFile}
            selectedPath={selectedFile?.path ?? null}
          />
        ) : (
          filteredFiles.map((f) => (
            <FlatRow
              key={f.path}
              node={f}
              onFileSelect={setSelectedFile}
              selectedPath={selectedFile?.path ?? null}
            />
          ))
        )}

        {mode === "flat" && filteredFiles.length === 0 && (
          <p className="text-sm text-text-tertiary text-center py-8">
            No files match "{searchQuery}"
          </p>
        )}
      </div>

      {/* selected file detail */}
      {selectedFile && (
        <div className="border-t border-border-subtle">
          <FileDetail node={selectedFile} />
        </div>
      )}
    </div>
  );
}
