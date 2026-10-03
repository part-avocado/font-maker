import { useState } from "react";
import { useModalDialog } from "./useModalDialog";

interface DialogOptions {
    confirmLabel?: string;
    cancelLabel?: string;   
}

type DialogReq = 
    | {type: 'confirm'; message:string; confirmLabel: string; cancelLabel: string; resolve: (value: boolean) => void}
    | {type: 'prompt'; message:string; defaultValue: string; confirmLabel: string; cancelLabel: string; resolve: (value: string | null ) => void }
    | {type: 'alert'; message:string; confirmLabel: string; resolve: () => void}


// custom popups for good ui/ux :hehe:
export function useDialog() {
    const [request, setRequest] = useState<DialogReq | null>(null);
    const confirmDialog = (message: string, options: DialogOptions = {}) => new Promise<boolean>((resolve) => {
        setRequest({kind: 'confirm', message, confirmLabel: options.confirmLabel ?? 'Continue', cancelLabel: options.cancelLabel ?? 'Cancel', resolve})
    })

    const promptDialog = (message: string, defaultValue = '', options: DialogOptions = {}) => new Promise<string | null>((resolve) => {
        setRequest({ kind: 'prompt', message, defaultValue, confirmLabel: options.confirmLabel ?? 'Save', cancelLabel: options.cancelLabel ?? 'Cancel', resolve})
    })

    const alertDialog = (message: string, options: DialogOptions {}) => new Promise<void>((resolve) => {
        setRequest({kind: 'alert', message, confirmLabel: options.confirmLabel ?? 'OK', resolve: () => resolve()})
    })

    const dialogNode = request ? <AppDialog request={request} onDismiss={() => setRequest(null)} /> : null
    return {confirmDialog, promptDialog, alertDialog, dialogNode}
}