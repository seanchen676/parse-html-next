"use client";

import { useCallback, useState } from "react";

export default function Home() {
  const [htmlInput, setHtmlInput] = useState("");
  const [isPending, setIsPending] = useState(false);

  const handleParseHtml = useCallback((html: string) => {
    const htmlEntityDecode = (text: string) => {
      // 先處理 JavaScript 跳脫字符（如 \"）
      const decoded = text.replace(/\\"/g, '"').replace(/\\'/g, "'");

      // 再處理 HTML entities（如 &lt;）
      const textArea = document.createElement("textarea");
      textArea.innerHTML = decoded;
      return textArea.value;
    };
    const blob = new Blob([htmlEntityDecode(html)], {
      type: "text/html;charset=UTF-8",
    });
    const url = URL.createObjectURL(blob);
    window.open(url);
    setTimeout(() => URL.revokeObjectURL(url), 60_000);
  }, []);

  const handleSubmit = async () => {
    if (!htmlInput.trim()) return;

    setIsPending(true);

    // 延遲執行以確保 loading 狀態先顯示
    await new Promise((resolve) => setTimeout(resolve, 100));

    try {
      handleParseHtml(htmlInput);
      // 給使用者視覺回饋
      await new Promise((resolve) => setTimeout(resolve, 500));
    } finally {
      setIsPending(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-10 bg-linear-to-b from-slate-50 to-slate-100">
      <div className="w-full max-w-2xl rounded-3xl border border-slate-200 bg-white/80 p-8 shadow-xl backdrop-blur">
        <header className="mb-6 text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-slate-500">
            工具
          </p>
          <h1 className="mt-2 text-3xl font-semibold text-slate-900">
            HTML 快速預覽
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            貼上含 HTML entity 的字串，按下按鈕後會在新視窗開啟解析後的內容。
          </p>
        </header>
        <label className="flex flex-col gap-3 text-sm font-medium text-slate-700">
          HTML String
          <textarea
            className="min-h-56 resize-y rounded-2xl border border-slate-300 bg-white/70 p-4 font-mono text-sm text-slate-900 shadow-inner focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-100"
            placeholder="&lt;div&gt;Hello World&lt;/div&gt;"
            value={htmlInput}
            onChange={(event) => setHtmlInput(event.target.value)}
            spellCheck={false}
          />
        </label>
        <button
          type="button"
          className="mt-6 cursor-pointer inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 px-5 py-3 text-base font-semibold text-white shadow-lg shadow-blue-600/30 transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:bg-slate-400"
          onClick={handleSubmit}
          disabled={!htmlInput.trim() || isPending}
        >
          {isPending ? (
            <>
              <svg
                className="h-5 w-5 animate-spin"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              處理中...
            </>
          ) : (
            "解析並開啟"
          )}
        </button>
      </div>
    </main>
  );
}
