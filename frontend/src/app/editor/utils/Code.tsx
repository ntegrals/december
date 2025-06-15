import Editor from "@monaco-editor/react";
import { File } from "../utils/FileManager";

interface CodeProps {
  selectedFile: File | undefined;
  onChange: (value: string | undefined) => void;
}

export const Code = ({ selectedFile, onChange }: CodeProps) => {
  const handleEditorDidMount = (editor: any, monaco: any) => {
    monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
      noSemanticValidation: true,
      noSyntaxValidation: true,
      noSuggestionDiagnostics: true,
    });

    monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
      noSemanticValidation: true,
      noSyntaxValidation: true,
      noSuggestionDiagnostics: true,
    });

    monaco.languages.html.htmlDefaults.setOptions({
      validate: false,
    });

    monaco.languages.css.cssDefaults.setOptions({
      validate: false,
    });

    monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
      validate: false,
    });

    monaco.editor.defineTheme("no-errors", {
      base: "vs-dark",
      inherit: true,
      rules: [],
      colors: {
        "editorError.foreground": "#00000000",
        "editorError.background": "#00000000",
        "editorWarning.foreground": "#00000000",
        "editorWarning.background": "#00000000",
        "editorInfo.foreground": "#00000000",
        "editorInfo.background": "#00000000",
        "editorSquiggles.error": "#00000000",
        "editorSquiggles.warning": "#00000000",
        "editorSquiggles.info": "#00000000",
      },
    });

    monaco.editor.setTheme("no-errors");
  };

  if (!selectedFile) {
    return (
      <div className="flex-1 bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-400 text-lg mb-2">No file selected</div>
          <div className="text-gray-500 text-sm">
            Select a file from the sidebar to start editing
          </div>
        </div>
      </div>
    );
  }

  let language = selectedFile.name.split(".").pop();

  if (language === "js" || language === "jsx") language = "javascript";
  else if (language === "ts" || language === "tsx") language = "typescript";

  return (
    <div className="flex-1 m-0 text-base">
      <Editor
        height="100%"
        language={language}
        value={selectedFile.content}
        theme="no-errors"
        onChange={onChange}
        onMount={handleEditorDidMount}
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          lineNumbers: "on",
          roundedSelection: false,
          scrollBeyondLastLine: false,
          automaticLayout: true,
          wordWrap: "on",
          tabSize: 2,
          insertSpaces: true,
          renderWhitespace: "selection",
          bracketPairColorization: { enabled: false },
          smoothScrolling: true,
          cursorBlinking: "smooth",
          folding: true,
          foldingHighlight: true,
          showFoldingControls: "mouseover",
        }}
      />
    </div>
  );
};
