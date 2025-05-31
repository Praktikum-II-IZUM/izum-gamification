import * as React from "react"

import type {
  ToastActionElement,
} from "@/components/ui/toast"

const TOAST_LIMIT = 1
const TOAST_REMOVE_DELAY = 2000 // 2 seconds

// Define the basic toast properties type
export type Toast = {
  title?: React.ReactNode
  description?: React.ReactNode
  action?: ToastActionElement
}

// Define the full toast type with internal properties
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
        open: true // Start with open: true for immediate display
      }
      
      // Add to remove queue for auto-dismiss
      addToRemoveQueue(newToast.id)
      
      // Update state with new toast
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
      // Clear any existing timeout for this toast
      if (toastTimeouts.has(action.toastId)) {
        clearTimeout(toastTimeouts.get(action.toastId))
        toastTimeouts.delete(action.toastId)
      }
      
      // Set open to false first for animation
      const updatedState = {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === action.toastId ? { ...t, open: false } : t
        ),
      }

      // Schedule removal after animation
      setTimeout(() => {
        dispatch({ type: "REMOVE_TOAST", toastId: action.toastId })
      }, 300) // Match animation duration
      
      return updatedState

    case "REMOVE_TOAST":
      // Clean up timeout if it exists
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
  }, []) // Remove state dependency to avoid unnecessary re-renders

  return {
    ...state,
    toast,
    dismiss: (toastId?: string) => {
      if (toastId) {
        dispatch({ type: "DISMISS_TOAST", toastId })
      } else {
        // If no toastId provided, dismiss all toasts
        state.toasts.forEach(toast => {
          dispatch({ type: "DISMISS_TOAST", toastId: toast.id })
        })
      }
    },
  }
}

export { useToast, toast }