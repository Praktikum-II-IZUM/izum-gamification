import * as React from "react"

import type {
  ToastActionElement,
  ToastProps,
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

const actionTypes = {
  ADD_TOAST: "ADD_TOAST",
  UPDATE_TOAST: "UPDATE_TOAST",
  DISMISS_TOAST: "DISMISS_TOAST",
  REMOVE_TOAST: "REMOVE_TOAST",
} as const

let count = 0

function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER
  return count.toString()
}

type ActionType = typeof actionTypes

type Action =
  | {
      type: ActionType["ADD_TOAST"]
      toast: ToasterToast
    }
  | {
      type: ActionType["UPDATE_TOAST"]
      toast: Partial<ToasterToast>
    }
  | {
      type: ActionType["DISMISS_TOAST"]
      toastId?: ToasterToast["id"]
    }
  | {
      type: ActionType["REMOVE_TOAST"]
      toastId?: ToasterToast["id"]
    }

interface State {
  toasts: ToasterToast[]
}

const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>()

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
          open: false // Start with open: false
        }
        
        // Add to remove queue for auto-dismiss
        addToRemoveQueue(newToast.id)
        
        // Update state with new toast
        const newState = {
          ...state,
          toasts: [newToast, ...state.toasts].slice(0, TOAST_LIMIT),
        }

        // Set open to true after a short delay for smoother animation
        setTimeout(() => {
          dispatch({
            type: "UPDATE_TOAST",
            toast: { id: newToast.id, open: true }
          })
        }, 100) // Small delay before showing
        
        return newState
  
      case "UPDATE_TOAST":
        return {
          ...state,
          toasts: state.toasts.map((t) =>
            t.id === action.toast.id ? { ...t, ...action.toast } : t
          ),
        }
  
      case "DISMISS_TOAST":
        const { toastId } = action

        if (toastId) {
          const toast = state.toasts.find(t => t.id === toastId)
          if (toast) {
            // Set open to false first
            dispatch({
              type: "UPDATE_TOAST",
              toast: { ...toast, open: false }
            })

            // Wait for animation to finish before removing
            setTimeout(() => {
              dispatch({ type: "REMOVE_TOAST", toastId })
            }, 300) // Match animation duration
          }
        } else {
          state.toasts.forEach((toast) => {
            dispatch({
              type: "UPDATE_TOAST",
              toast: { ...toast, open: false }
            })
          })

          // Wait for animation to finish before removing
          setTimeout(() => {
            dispatch({ type: "REMOVE_TOAST" })
          }, 300)
        }

        return state
  
      case "REMOVE_TOAST":
        if (action.toastId === undefined) {
          return {
            ...state,
            toasts: [],
          }
        }
        return {
          ...state,
          toasts: state.toasts.filter((t) => t.id !== action.toastId),
        }
    }
  }

const listeners: Array<(state: State) => void> = []

let memoryState: State = { toasts: [] }

function dispatch(action: Action) {
  memoryState = reducer(memoryState, action)
  listeners.forEach((listener) => {
    listener(memoryState)
  })
}

function toast({ ...props }: Toast) {
  const id = genId()

  const update = (props: ToasterToast) =>
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
  }, [state])

  return {
    ...state,
    toast,
    dismiss: (toastId?: string) => dispatch({ type: "DISMISS_TOAST", toastId }),
  }
}

export { useToast, toast }