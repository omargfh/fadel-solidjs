import { createSignal, onCleanup, Show } from "solid-js";

interface PromptProps {
    message: string;
    value: string;
    setValue: (value: string) => void;
    isPrompting: Accessor<boolean>;
    setIsPrompting: (value: boolean) => void;
}

export const Prompt: Component<PromptProps> = ({ message, value, setValue, isPrompting, setIsPrompting }) => {
    const [promptValue, setPromptValue] = createSignal(value);

    const cancel = () => {
        setIsPrompting(false);
    };

    const confirm = () => {
        setValue(promptValue());
        setIsPrompting(false);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Enter") {
            confirm();
        } else if (e.key === "Escape") {
            cancel();
        }
    };

    return (
        <>
            <Show when={isPrompting()}>
                <div
                    class="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center"
                    style="z-index: 9999"
                    onClick={cancel}
                    onKeyDown={handleKeyDown}
                >
                    <div
                        class="bg-white rounded-lg shadow-lg p-4 w-96"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div class="flex flex-col">
                            <label class="text-gray-600 text-sm mb-2">{message}</label>
                            <input
                                type="text"
                                class="border border-gray-300 rounded-lg px-3 py-2 mb-4"
                                value={promptValue()}
                                onInput={(e) => setPromptValue(e.currentTarget.value)}
                            />
                            <div class="flex justify-end">
                                <button
                                    class="bg-gray-200 text-gray-600 px-4 py-2 rounded-lg mr-2"
                                    onClick={cancel}
                                >
                                    Cancel
                                </button>
                                <button
                                    class="bg-blue-500 text-white px-4 py-2 rounded-lg"
                                    onClick={confirm}
                                >
                                    Confirm
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </Show>
        </>
    );
};