"use client";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { MailPlus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { string } from "yup";
import { useState } from "react";
import { set } from "date-fns";
import { toast } from "react-toastify";
import axiosInstance from "@/lib/axiosInstance";

interface Props {
  data: any;
}

export default function EmailAddToGroupForm({ data }: Props) {
  const groups = data?.data;
  const [addedEmails, setAddedEmails] = useState<any>([]);
  const form = useForm({
    defaultValues: {
      email: "",
      group: "",
      "button-0": "",
      "reset-button-0": "",
      "submit-button-0": "",
    },
  });

  async function onSubmit(values: any) {
    if (addedEmails.length === 0) {
      toast.warn("No emails were added to the list", {
        position: "top-center",
        autoClose: 3000,
      });
      return;
    }
    try {
      const response = await axiosInstance.post("/api/mails/v1/email/lists/", {
        email: addedEmails,
        group: values.group,
      });
      if (response.status === 201) {
        toast.success("Emails are added to the group successfully", {
          position: "top-center",
          autoClose: 3000,
        });
        form.reset();
        form.clearErrors();
        setAddedEmails([]);
      }
    } catch (error) {
      toast.error("Something went wrong!!", {
        position: "top-center",
        autoClose: 3000,
      });
    }
  }

  function onReset() {
    form.reset();
    form.clearErrors();
    setAddedEmails([]);
  }

  const handleAddEmail = () => {
    const email = form.getValues("email")?.trim();

    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    if (!email) {
      form.setError("email", {
        type: "manual",
        message: "Email is required",
      });
      return;
    }

    if (!isValidEmail) {
      form.setError("email", {
        type: "manual",
        message: "Invalid email address",
      });
      return;
    }

    if (addedEmails.includes(email)) {
      form.setError("email", {
        type: "manual",
        message: "Email already added",
      });
      return;
    }

    setAddedEmails([...addedEmails, email]);
    form.setValue("email", "");
    form.clearErrors("email");
  };

  return (
    <div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          onReset={onReset}
          className="space-y-8 @container"
        >
          <div className="grid grid-cols-12 gap-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="col-span-8 col-start-auto flex self-end flex-col gap-2 space-y-0 items-start">
                  <FormLabel className="flex shrink-0">Email</FormLabel>

                  <div className="w-full">
                    <FormControl>
                      <div className="relative w-full">
                        <Input
                          key="email-input-0"
                          placeholder="example@gmail.com"
                          type="email"
                          id="email-input-0"
                          className=" ps-9"
                          {...field}
                        />
                        <div
                          className={
                            "text-muted-foreground pointer-events-none absolute inset-y-0 flex items-center justify-center  peer-disabled:opacity-50 start-0 ps-3"
                          }
                        >
                          <MailPlus className="size-4" strokeWidth={2} />
                        </div>
                      </div>
                    </FormControl>

                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="button-0"
              render={({ field }) => (
                <FormItem className="col-span-4 col-start-auto flex self-end flex-col gap-2 space-y-0 items-start">
                  <div className="w-full">
                    <FormControl>
                      <Button
                        key="button-0"
                        id="button-0"
                        name=""
                        className="w-full"
                        type="button"
                        variant="outline"
                        onClick={() => handleAddEmail()}
                      >
                        <Plus className="size-4" strokeWidth="2" />
                        Add
                      </Button>
                    </FormControl>

                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="group"
              rules={{ required: "Group is required" }}
              render={({ field }) => (
                <FormItem className="col-span-12 col-start-auto flex self-end flex-col gap-2 space-y-0 items-start">
                  <FormLabel className="flex shrink-0">Group</FormLabel>

                  <div className="w-full space-y-2">
                    <FormControl>
                      <Select
                        key="group"
                        value={field.value}
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger className="w-full ">
                          <SelectValue placeholder="Select a group" />
                        </SelectTrigger>
                        <SelectContent>
                          {groups.map((group: any) => (
                            <SelectItem key={group.name} value={`${group.id}`}>
                              {group.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormDescription>
                      <p className="text-muted-foreground pl-2">Select a group that you want to add those emails</p>
                    </FormDescription>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
           <div className="w-full flex justify-start items-center gap-4">
             <FormField
              control={form.control}
              name="reset-button-0"
              render={({ field }) => (
                <FormItem className="">
                    <FormControl>
                      <Button
                        key="reset-button-0"
                        id="reset-button-0"
                        name=""
                        type="reset"
                        variant="outline"
                        size={"default"}
                      >
                        Reset
                      </Button>
                    </FormControl>
                    <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="submit-button-0"
              render={({ field }) => (
                <FormItem className="">
                    <FormControl>
                      <Button
                        key="submit-button-0"
                        id="submit-button-0"
                        name=""
                        type="submit"
                        variant="default"
                        size={"default"}
                      >
                        Submit
                      </Button>
                    </FormControl>
                    <FormMessage />
                </FormItem>
              )}
            />
           </div>
          </div>
        </form>
      </Form>
      {addedEmails.length > 0 && (
        <div className="mt-4 space-y-2">
          <h4 className="text-sm font-medium text-muted-foreground">
            Added Emails
          </h4>
          <ul className="space-y-1 text-sm">
            {addedEmails.map((email: any, index: number) => (
              <li
                key={index}
                className="flex justify-between items-center bg-background px-3 py-1 rounded"
              >
                <span>{email}</span>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() =>
                    setAddedEmails(
                      addedEmails.filter((e: string) => e !== email)
                    )
                  }
                >
                  Remove
                </Button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
