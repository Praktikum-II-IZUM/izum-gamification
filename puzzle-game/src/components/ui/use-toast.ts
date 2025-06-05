import * as React from "react"

import type {
  ToastActionElement,
} from "@/components/ui/toast"

const TOAST_LIMIT = 1
const TOAST_REMOVE_DELAY = 2000 // 2 sekundi

// vrsta lastnosti obvestila
export type Toast = {
  title?: React.ReactNode
  description?: React.ReactNode
  action?: ToastActionElement
}

// vrsto obvestila z notranjimi lastnostmi
type ToasterToast = Toast & {
  id: string
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

let count = 0

function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER
  return count.toString()
}

type AddToastAction = {
  type: "ADD_TOAST"
  toast: ToasterToast
}

type UpdateToastAction = {
  type: "UPDATE_TOAST"
  toast: Partial<ToasterToast> & { id: string }
}

type DismissToastAction = {
  type: "DISMISS_TOAST"
  toastId: string
}

type RemoveToastAction = {
  type: "REMOVE_TOAST"
  toastId: string
}

type Action = AddToastAction | UpdateToastAction | DismissToastAction | RemoveToastAction

interface State {
  toasts: ToasterToast[]
}

const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>()

let memoryState: State = { toasts: [] }
const listeners: Array<(state: State) => void> = []

function dispatch(action: Action) {
  memoryState = reducer(memoryState, action)
  listeners.forEach((listener) => {
    listener(memoryState)
  })
}

const addToRemoveQueue = (toastId: string) => {
  if (toastTimeouts.has(toastId)) {
    return
  }

  const timeout = setTimeout(() => {
    toastTimeouts.delete(toastId)
    dispatch({
      type: "REMOVE_TOAST",
      toastId: toastId,
    })
  }, TOAST_REMOVE_DELAY)

  toastTimeouts.set(toastId, timeout)
}

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "ADD_TOAST":
      const newToast = {
        ...action.toast,
        id: action.toast.id || genId(),
        open: true // zacetek z open: true za prikaz
      }
      
      // dodaj v vrsto za odstranitev za samodejno zapiranje
      addToRemoveQueue(newToast.id)
      
      // posodobi stanje z novim obvestilom
      return {
        ...state,
        toasts: [newToast, ...state.toasts].slice(0, TOAST_LIMIT),
      }
    
    case "UPDATE_TOAST":
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === action.toast.id ? { ...t, ...action.toast } : t
        ),
      }
    
    case "DISMISS_TOAST":
      // pocisti obstoječi casovni zamik za to obvestilo
      if (toastTimeouts.has(action.toastId)) {
        clearTimeout(toastTimeouts.get(action.toastId))
        toastTimeouts.delete(action.toastId)
      }
      
      // nastavi open na false za animacijo
      const updatedState = {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === action.toastId ? { ...t, open: false } : t
        ),
      }

      // odstranitev po animaciji
      setTimeout(() => {
        dispatch({ type: "REMOVE_TOAST", toastId: action.toastId })
      }, 300) // ujemanje trajanja animacije
      
      return updatedState

    case "REMOVE_TOAST":
      // pocisti casovni zamik
      if (toastTimeouts.has(action.toastId)) {
        clearTimeout(toastTimeouts.get(action.toastId))
        toastTimeouts.delete(action.toastId)
      }
      
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.toastId),
      }
      
    default:
      return state
  }
}

function toast({ ...props }: Toast) {
  const id = genId()

  const update = (props: Partial<ToasterToast>) =>
    dispatch({
      type: "UPDATE_TOAST",
      toast: { ...props, id },
    })
    
  const dismiss = () => dispatch({ type: "DISMISS_TOAST", toastId: id })

  dispatch({
    type: "ADD_TOAST",
    toast: {
      ...props,
      id,
      open: true,
      onOpenChange: (open) => {
        if (!open) dismiss()
      },
    },
  })

  return {
    id: id,
    dismiss,
    update,
  }
}

function useToast() {
  const [state, setState] = React.useState<State>(memoryState)

  React.useEffect(() => {
    listeners.push(setState)
    return () => {
      const index = listeners.indexOf(setState)
      if (index > -1) {
        listeners.splice(index, 1)
      }
    }
  }, []) // odstrani odvisnost od stanja

  return {
    ...state,
    toast,
    dismiss: (toastId?: string) => {
      if (toastId) {
        dispatch({ type: "DISMISS_TOAST", toastId })
      } else {
        // ce ni id-ja obvestila, zapri vsa obvestila
        state.toasts.forEach(toast => {
          dispatch({ type: "DISMISS_TOAST", toastId: toast.id })
        })
      }
    },
  }
}

export { useToast, toast }