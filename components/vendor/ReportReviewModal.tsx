"use client";

interface ReportReviewModalProps {
  open: boolean;
  reportReason: string;
  setReportReason: (value: string) => void;
  onClose: () => void;
  onSubmit: () => void;
}

export default function ReportReviewModal({
  open,
  reportReason,
  setReportReason,
  onClose,
  onSubmit,
}: ReportReviewModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-3xl bg-white dark:bg-[#111827] shadow-2xl border border-gray-200 dark:border-gray-800">

        {/* Header */}
        <div className="border-b border-gray-200 dark:border-gray-800 px-6 py-5">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Report Review
          </h2>

          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Please explain why you are reporting this customer's review.
          </p>
        </div>

        {/* Body */}
        <div className="p-6">
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Explanation
          </label>

          <textarea
            rows={6}
            value={reportReason}
            onChange={(e) => setReportReason(e.target.value)}
            placeholder="Write your explanation here..."
            className="w-full rounded-2xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#1F2937] p-4 text-sm text-gray-700 dark:text-white outline-none focus:ring-2 focus:ring-red-500 resize-none"
          />
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 border-t border-gray-200 dark:border-gray-800 px-6 py-5">

          <button
            onClick={onClose}
            className="rounded-xl border border-gray-300 dark:border-gray-700 px-5 py-2 font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          >
            Cancel
          </button>

          <button
            onClick={onSubmit}
            className="rounded-xl bg-red-600 px-5 py-2 font-semibold text-white hover:bg-red-700 transition"
          >
            Submit Report
          </button>

        </div>

      </div>
    </div>
  );
}