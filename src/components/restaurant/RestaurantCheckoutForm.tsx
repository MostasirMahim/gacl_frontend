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
import { Percent, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "../ui/button";
import { useRestaurantCartStore } from "@/store/restaurantStore";
import axiosInstance from "@/lib/axiosInstance";
import { toast } from "react-toastify";
import { Checkbox } from "../ui/checkbox";
import { ScrollArea } from "../ui/scroll-area";
import { useState, useEffect } from "react";
import { Label } from "../ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";

interface Props {
  memberData: any;
  promoCodeData: any;
}

function RestaurantCheckoutForm({ memberData, promoCodeData }: Props) {
  const form = useForm({
    defaultValues: {
      member_ID: "",
      promo_code: "",
      "reset-button-0": "",
      "submit-button-0": "",
    },
  });
  const { setError } = form;

  const cart = useRestaurantCartStore((state) => state.cart);
  const restaurant = useRestaurantCartStore((state) => state.restaurant);
  const removeItem = useRestaurantCartStore((state) => state.removeItem);
  const [searchMember, setSearchMember] = useState("");
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  const members = memberData.data;
  const promoCodes = promoCodeData.data;

  const filteredMembers =
    members?.filter((id: any) => {
      const matchesSearch = id
        .toLowerCase()
        .includes(searchMember.toLowerCase());
      return matchesSearch;
    }) || [];

  async function onSubmit(values: any) {
    try {
      const requestData: any = {
        restaurant_items: cart,
        restaurant: restaurant,
        member_ID: values.member_ID,
      };

      if (values.promo_code !== "") {
        requestData.promo_code = values.promo_code;
      }
      const response = await axiosInstance.post(
        "/api/restaurants/v1/restaurants/items/buy/",
        requestData
      );
      if (response.status === 201) {
        toast.success("Invoice created successfully");
      }
    } catch (error: any) {
      console.log(error);
      console.log(error);
      if (error.response?.data?.errors) {
        const errors = error.response.data.errors;

        // Field specific errors
        for (const key in errors) {
          if (key !== "non_field_errors") {
            setError(key as any, {
              type: "server",
              message: errors[key][0],
            });
          }
        }

        // Non-field errors (e.g. general form errors)
        if (errors.non_field_errors) {
          setError("root", {
            type: "server",
            message: errors.non_field_errors.join(" "),
          });
        }
      }
      toast.error(error?.response?.data?.message || "Something went wrong");
    }
  }

  function onReset() {
    form.reset();
    form.clearErrors();
  }

  return (
    <div className="space-y-6 font-primary">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight">Checkout</h1>
        <p className="text-muted-foreground">
          Review your selected items and complete the purchase.
        </p>
      </div>
      <div className="p-4  rounded-2xl shadow-md border">
        <h2 className="text-xl font-bold border-b pb-2">🛒 Selected Items</h2>

        <div className="space-y-3">
          {!mounted ? (
            <p className="text-gray-500 italic">Loading cart...</p>
          ) : cart.length > 0 ? (
            cart.map((item: any) => (
              <div
                key={item.id}
                className="flex items-center justify-between rounded-xl p-3 hover:shadow-sm transition"
              >
                <div className="space-y-1">
                  <p className="font-semibold ">{item.name}</p>
                  <p className="text-sm ">
                    Qty: <span className="font-medium">{item.quantity}</span>
                  </p>
                  <p className="text-green-600 font-bold">
                    ${item.selling_price * item.quantity}
                  </p>
                </div>

                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => removeItem(item.id)}
                >
                  Remove
                </Button>
              </div>
            ))
          ) : (
            <p className="text-gray-500 italic">No items in the cart</p>
          )}
        </div>
      </div>
      <div className=" p-4 rounded-2xl shadow-md border">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            onReset={onReset}
            className="space-y-8 w-full "
          >
            <div className="flex flex-col md:flex-row justify-start items-start gap-3 w-full ">
              <div className="w-full">
                <FormField
                  control={form.control}
                  name="member_ID"
                  render={({ field }) => (
                    <FormItem>
                      <div>
                        <FormControl>
                          <div className="w-full flex flex-col space-y-2 shadow-lg rounded-xl p-4 dark:bg-muted border">
                            <h2 className="text-lg font-semibold mb-2">
                              Select Member ID
                            </h2>
                            <div className="space-y-3">
                              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                                <div className="relative flex-1">
                                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                  <Input
                                    type="search"
                                    placeholder="Search Members..."
                                    className="pl-10 bg-background focus-visible:ring-0 focus-visible:ring-offset-0 h-10"
                                    value={searchMember}
                                    onChange={(e) =>
                                      setSearchMember(e.target.value)
                                    }
                                  />
                                </div>
                              </div>
                              <ScrollArea className="h-[250px] sm:h-[300px] border rounded-md p-3 sm:p-4">
                                <div className="space-y-2 sm:space-y-3">
                                  {filteredMembers?.map(
                                    (ids: any, index: number) => (
                                      <div
                                        key={index}
                                        className="flex items-center space-x-2 p-1 hover:bg-muted/50 rounded"
                                      >
                                        <Checkbox
                                          id={ids}
                                          checked={
                                            form.getValues("member_ID") === ids
                                          }
                                          onCheckedChange={(checked) =>
                                            field.onChange(checked ? ids : "")
                                          }
                                        />
                                        <Label
                                          htmlFor={ids}
                                          className="text-xs sm:text-sm font-mono cursor-pointer flex-1 leading-tight"
                                        >
                                          {ids}
                                        </Label>
                                      </div>
                                    )
                                  )}
                                </div>
                              </ScrollArea>
                            </div>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />
              </div>
              <Card className="w-full h-full shadow-md rounded-2xl border">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">
                    Promo Code
                  </CardTitle>
                  <CardDescription>
                    Apply your discount code to save on your order
                  </CardDescription>
                </CardHeader>

                <CardContent>
                  <FormField
                    control={form.control}
                    name="promo_code"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="sr-only">Promo Code</FormLabel>
                        <FormControl>
                          <div className="relative w-full">
                            <Input
                              key="text-input-0"
                              placeholder="Enter promo code"
                              type="text"
                              id="promo_code"
                              className="ps-9"
                              {...field}
                            />
                            <div className="text-muted-foreground pointer-events-none absolute inset-y-0 flex items-center start-0 ps-3">
                              <Percent className="size-4" strokeWidth={2} />
                            </div>
                          </div>
                        </FormControl>
                        <FormDescription>
                          Enter any promo codes if you have
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </div>
            <div className="flex flex-col md:flex-row items-start gap-2 w-full">
              <FormField
                control={form.control}
                name="reset-button-0"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel className="hidden shrink-0">Reset</FormLabel>

                    <div className="w-full ">
                      <FormControl>
                        <Button
                          key="reset-button-0"
                          id="reset-button-0"
                          name=""
                          className="w-full"
                          type="reset"
                          variant="outline"
                        >
                          Reset
                        </Button>
                      </FormControl>

                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="submit-button-0"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel className="hidden shrink-0">Submit</FormLabel>

                    <div className="w-full">
                      <FormControl>
                        <Button
                          key="submit-button-0"
                          id="submit-button-0"
                          name=""
                          className="w-full"
                          type="submit"
                          variant="default"
                        >
                          Submit
                        </Button>
                      </FormControl>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}

export default RestaurantCheckoutForm;
