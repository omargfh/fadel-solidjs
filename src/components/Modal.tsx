import { Component, createSignal, Show } from 'solid-js'

interface ModalProps {
    title: string,
    placeholder: string,
    input: string,
    setInput: (value: string) => void
}

export const Modal: Component<ModalProps> = ({ title, placeholder, input, setInput }) => {
    let [isOpen, setIsOpen] = createSignal(true);
    return (
        <>
            <div class={`fixed z-10 overflow-y-auto ${isOpen() ? 'block' : 'hidden'} center w-2/5 p-8 bg-neutral-800 rounded-2xl drop-shadow flex flex-col gap-3`}>
                <h3
                    class="text-xl font-bold text-center text-white"
                >{title}</h3>
                <input
                type="text"
                id="modal-popup"
                class={`bg-neutral-900 text-white text-sm rounded-lg  focus:ring-4 ring-gray-500 outline-none block w-full h-14 p-3 'pr-24`}
                placeholder={`${placeholder}`}
                value={input}
                onInput={(e) => setInput(e.currentTarget.value)}
                />
                <button
                    onClick={() => setIsOpen(false)}
                    class="bg-blue-500 text-white text-sm rounded-lg  focus:ring-4 ring-gray-500 outline-none block w-full h-14 p-3 'pr-24"
                >Save</button>
            </div>
        </>
    )
}
