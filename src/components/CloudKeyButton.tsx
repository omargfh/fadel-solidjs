import { Component } from "solid-js";
import {
    getCloudKey,
    updateCloudKey,
    clearCloudKey
} from "../store";

const CloudKeyButton: Component<{}> = (props) => {
    return <button
    onClick={() => {
        let api_key = prompt('Set or clear your API key: ', getCloudKey() ?? '')
        if (api_key === '') {
            clearCloudKey()
        } else {
            updateCloudKey(api_key)
        }
    }}
    type="button"
    class="text-black bg-[#24a8e0] focus:ring-4 focus:ring-[#fbfad0] rounded-lg font-bold text-sm px-5 py-1 h-16 grid place-content-center uppercase disabled:!bg-[#a0a0a0] disabled:cursor-not-allowed"
    >Set API Key</button>;
};

export default CloudKeyButton