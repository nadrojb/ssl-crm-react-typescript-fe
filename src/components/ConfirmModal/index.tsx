import {ButtonStandard} from "../ButtonStandard";

type ConfirmModalProps = {
    isOpen: boolean;
    title: string;
    message: string;
    confirmLabel?: string;
    cancelLabel?: string;
    isSubmitting?: boolean;
    errorMessage?: string | null;
    onClose: () => void;
    onConfirm: () => void;
};

export const ConfirmModal = ({
    isOpen,
    title,
    message,
    confirmLabel = "Confirm",
    cancelLabel = "Cancel",
    isSubmitting = false,
    errorMessage = null,
    onClose,
    onConfirm,
}: ConfirmModalProps) => {
    if (!isOpen) {
        return null;
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <div
                className="absolute inset-0 bg-black/50"
                onClick={isSubmitting ? undefined : onClose}
                aria-hidden="true"
            />

            <div
                role="dialog"
                aria-modal="true"
                className="relative w-full max-w-md rounded-lg bg-white p-6 shadow-xl"
            >
                <div className="space-y-2">
                    <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
                    <p className="text-sm text-gray-700">{message}</p>
                </div>

                {errorMessage ? (
                    <div className="mt-4 rounded-md bg-red-50 px-4 py-3 text-sm text-red-700">
                        {errorMessage}
                    </div>
                ) : null}

                <div className="mt-6 flex justify-end gap-3">
                    <ButtonStandard
                        type="button"
                        variant="secondary"
                        size="sm"
                        onClick={onClose}
                        disabled={isSubmitting}
                    >
                        {cancelLabel}
                    </ButtonStandard>

                    <ButtonStandard
                        type="button"
                        variant="dark"
                        size="sm"
                        onClick={onConfirm}
                        disabled={isSubmitting}
                    >
                        {confirmLabel}
                    </ButtonStandard>
                </div>
            </div>
        </div>
    )
}
export default ConfirmModal;