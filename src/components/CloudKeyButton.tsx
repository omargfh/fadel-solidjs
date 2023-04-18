import { Component, createEffect, createSignal, Show } from "solid-js";
import {
    getCloudKey,
    updateCloudKey,
    clearCloudKey
} from "../store";
import { Prompt } from "./Prompt";

const CloudKeyButton: Component<{}> = (props) => {
    let [is_prompting, set_is_prompting] = createSignal(false);
    let [prompt_value, set_prompt_value] = createSignal(getCloudKey() || '');
    createEffect(() => {
        if (prompt_value() === '') {
            clearCloudKey()
        } else {
            updateCloudKey(prompt_value())
        }
    }, [prompt_value])
    return <>
        <Show when={is_prompting}>
            <Prompt
                message="Enter your Cloud API Key"
                value={prompt_value()}
                setValue={set_prompt_value}
                isPrompting={is_prompting}
                setIsPrompting={set_is_prompting}
            />
        </Show>
        <button
    onClick={() => {
        set_prompt_value(getCloudKey() || '');
        set_is_prompting(true);
    }}
    type="button"
    class="text-black bg-[#24a8e0] focus:ring-4 focus:ring-[#fbfad0] rounded-lg font-bold text-sm px-5 py-1 h-16 grid place-content-center uppercase disabled:!bg-[#a0a0a0] disabled:cursor-not-allowed"
    >Set API Key</button>
    </>;
};

export default CloudKeyButton