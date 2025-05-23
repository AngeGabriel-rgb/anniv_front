"use client"
import type { DialogProps } from "@radix-ui/react-dialog"
import { Command as CommandPrimitive } from "cmdk"
import { Search } from "lucide-react"

import { cn } from "@/lib/utils"
import { Dialog, DialogContent } from "@/components/ui/dialog"

interface CommandDialogProps extends DialogProps {
  /**
   * Position du contenu dans la boîte de dialogue
   * @default 'center'
   */
  position?: "center" | "top"
  /**
   * Taille du dialogue
   * @default 'default'
   */
  size?: "default" | "lg" | "xl"
  /**
   * Afficher une barre de recherche
   * @default true
   */
  showSearch?: boolean
}

const CommandDialog = ({
  children,
  position = "center",
  size = "default",
  showSearch = true,
  ...props
}: CommandDialogProps) => {
  return (
    <Dialog {...props}>
      <DialogContent
        className={cn(
          "overflow-hidden p-0 shadow-lg",
          position === "top" && "top-[15%] translate-y-0",
          size === "lg" && "sm:max-w-[600px]",
          size === "xl" && "sm:max-w-[800px]",
        )}
      >
        <CommandPrimitive className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&_[cmdk-group]]:px-2 [&_[cmdk-input-wrapper]_svg]:h-5 [&_[cmdk-input-wrapper]_svg]:w-5 [&_[cmdk-input]]:h-12 [&_[cmdk-item]]:px-2 [&_[cmdk-item]]:py-3 [&_[cmdk-item]_svg]:h-5 [&_[cmdk-item]_svg]:w-5">
          {showSearch && (
            <div className="flex items-center border-b px-3" cmdk-input-wrapper="">
              <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
              <CommandPrimitive.Input
                className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Rechercher..."
              />
            </div>
          )}
          {children}
        </CommandPrimitive>
      </DialogContent>
    </Dialog>
  )
}

export { CommandDialog }
