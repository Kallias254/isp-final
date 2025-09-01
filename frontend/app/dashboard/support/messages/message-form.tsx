"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";

import { subscribers } from "@/app/dashboard/crm/subscribers/mock-data";
import { messageTemplates } from "@/app/dashboard/support/message-templates/mock-data";
import { buildings } from "@/app/dashboard/crm/buildings/mock-data";
import { plans } from "@/app/dashboard/billing/plans/mock-data"; // Assuming you have mock data for plans

const formSchema = z.object({
  type: z.enum(["sms", "email", "push"], { required_error: "Message type is required." }),
  useTemplate: z.boolean().default(false),
  templateId: z.string().optional(),
  subject: z.string().min(1, "Subject is required."),
  content: z.string().min(1, "Message content is required."),
}).and(
  z.discriminatedUnion("recipientType", [
    z.object({
      recipientType: z.literal("singleSubscriber"),
      singleSubscriberId: z.string().min(1, "Subscriber is required."),
    }),
    z.object({
      recipientType: z.literal("unregisteredUser"),
      unregisteredContact: z.string().min(1, "Contact is required."),
      unregisteredName: z.string().optional(),
    }),
    z.object({
      recipientType: z.literal("group"),
      groupType: z.enum(["all", "buildings", "plans"], { required_error: "Group type is required." }),
      groupIds: z.array(z.string()).optional(),
    }),
  ])
).superRefine((data, ctx) => {
  if (data.recipientType === "group" && data.groupType !== "all" && (!data.groupIds || data.groupIds.length === 0)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "At least one group must be selected.",
      path: ["groupIds"],
    });
  }
});

interface MessageFormProps {
  initialData?: any; // TODO: Define Message type
}

export function MessageForm({ initialData }: MessageFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      type: "sms",
      useTemplate: false,
      subject: "",
      content: "",
    },
  });

  const useTemplate = form.watch("useTemplate");
  const recipientType = form.watch("recipientType");

  React.useEffect(() => {
    if (useTemplate && form.getValues("templateId")) {
      const selectedTemplate = messageTemplates.find(t => t.id === form.getValues("templateId"));
      if (selectedTemplate) {
        form.setValue("subject", selectedTemplate.templateName);
        form.setValue("content", selectedTemplate.content);
      }
    }
  }, [useTemplate, form.getValues("templateId"), form]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    // Here you would typically send the message
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Message Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select message type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="sms">SMS</SelectItem>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="push">Push Notification</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="recipientType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Recipient Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select recipient type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="singleSubscriber">Single Subscriber</SelectItem>
                  <SelectItem value="unregisteredUser">Unregistered User</SelectItem>
                  <SelectItem value="group">Group</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {recipientType === "singleSubscriber" && (
          <FormField
            control={form.control}
            name="singleSubscriberId"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Subscriber</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        role="combobox"
                        className={cn(
                          "w-[200px] justify-between",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value
                          ? subscribers.find(
                              (subscriber) => subscriber.id === field.value
                            )?.name
                          : "Select subscriber"}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-[200px] p-0">
                    <Command>
                      <CommandInput placeholder="Search subscriber..." />
                      <CommandList>
                        <CommandEmpty>No subscriber found.</CommandEmpty>
                        <CommandGroup>
                          {subscribers.map((subscriber) => (
                            <CommandItem
                              value={subscriber.id}
                              key={subscriber.id}
                              onSelect={() => {
                                form.setValue("singleSubscriberId", subscriber.id);
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  subscriber.id === field.value
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                              {subscriber.name}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {recipientType === "unregisteredUser" && (
          <>
            <FormField
              control={form.control}
              name="unregisteredContact"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contact (Phone or Email)</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. +254712345678 or example@email.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="unregisteredName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}

        {recipientType === "group" && (
          <>
            <FormField
              control={form.control}
              name="groupType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Group Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select group type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="all">All Subscribers</SelectItem>
                      <SelectItem value="buildings">Buildings</SelectItem>
                      <SelectItem value="plans">Plans</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            {form.watch("groupType") !== "all" && (
              <FormField
                control={form.control}
                name="groupIds"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Select Groups</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            role="combobox"
                            className={cn(
                              "w-[200px] justify-between",
                              !field.value || field.value.length === 0 && "text-muted-foreground"
                            )}
                          >
                            {field.value && field.value.length > 0
                              ? `${field.value.length} selected`
                              : "Select groups..."}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-[200px] p-0">
                        <Command>
                          <CommandInput placeholder="Search groups..." />
                          <CommandList>
                            <CommandEmpty>No group found.</CommandEmpty>
                            <CommandGroup>
                              {(form.watch("groupType") === "buildings" ? buildings : plans).map((item) => (
                                <CommandItem
                                  value={item.id}
                                  key={item.id}
                                  onSelect={() => {
                                    const currentIds = new Set(field.value || []);
                                    if (currentIds.has(item.id)) {
                                      currentIds.delete(item.id);
                                    } else {
                                      currentIds.add(item.id);
                                    }
                                    form.setValue("groupIds", Array.from(currentIds));
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      field.value && field.value.includes(item.id)
                                        ? "opacity-100"
                                        : "opacity-0"
                                    )}
                                  />
                                  {item.name}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </>
        )}

        <FormField
          control={form.control}
          name="useTemplate"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow-sm">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Use Template</FormLabel>
                <FormDescription>
                  Check this box to select a message template.
                </FormDescription>
              </div>
            </FormItem>
          )}
        />

        {useTemplate && (
          <FormField
            control={form.control}
            name="templateId"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Template</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        role="combobox"
                        className={cn(
                          "w-[200px] justify-between",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value
                          ? messageTemplates.find(
                              (template) => template.id === field.value
                            )?.templateName
                          : "Select template"}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-[200px] p-0">
                    <Command>
                      <CommandInput placeholder="Search template..." />
                      <CommandList>
                        <CommandEmpty>No template found.</CommandEmpty>
                        <CommandGroup>
                          {messageTemplates.map((template) => (
                            <CommandItem
                              value={template.id}
                              key={template.id}
                              onSelect={() => {
                                form.setValue("templateId", template.id);
                                const selectedTemplate = messageTemplates.find(t => t.id === template.id);
                                if (selectedTemplate) {
                                  form.setValue("subject", selectedTemplate.templateName);
                                  form.setValue("content", selectedTemplate.content);
                                }
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  template.id === field.value
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                              {template.templateName}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <FormField
          control={form.control}
          name="subject"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Subject</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Important Update" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Message Content</FormLabel>
              <FormControl>
                <Textarea placeholder="Type your message here..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">Send Message</Button>
      </form>
    </Form>
  );
}