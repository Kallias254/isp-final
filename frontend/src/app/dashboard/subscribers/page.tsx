"use client";

import { useState } from "react";
import ReactPaginate from "react-paginate";
import { seedSubscribers } from "@/components/subscribers/data";
import { QuickAddSubscriberDrawer } from "@/components/subscribers/quick-add-subscriber-drawer";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const ITEMS_PER_PAGE = 10;

export default function SubscribersPage() {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(0);

  const filteredSubscribers = seedSubscribers.filter((subscriber) => {
    const searchTerm = search.toLowerCase();
    return (
      subscriber.firstName.toLowerCase().includes(searchTerm) ||
      subscriber.lastName.toLowerCase().includes(searchTerm) ||
      subscriber.email?.toLowerCase().includes(searchTerm)
    );
  });

  const pageCount = Math.ceil(filteredSubscribers.length / ITEMS_PER_PAGE);
  const offset = currentPage * ITEMS_PER_PAGE;
  const currentPageData = filteredSubscribers.slice(offset, offset + ITEMS_PER_PAGE);

  const handlePageClick = ({ selected }: { selected: number }) => {
    setCurrentPage(selected);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Subscribers</CardTitle>
        <CardDescription>A list of all your subscribers.</CardDescription>
        <div className="flex items-center gap-4 mt-4">
          <Input
            placeholder="Search by name or email"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-sm"
          />
          <QuickAddSubscriberDrawer>
            <Button>Add Subscriber</Button>
          </QuickAddSubscriberDrawer>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Plan</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentPageData.map((subscriber) => (
              <TableRow key={subscriber.id}>
                <TableCell>{subscriber.firstName} {subscriber.lastName}</TableCell>
                <TableCell>{subscriber.email}</TableCell>
                <TableCell>{subscriber.plan}</TableCell>
                <TableCell>
                  <Badge variant={subscriber.status === "Active" ? "default" : "destructive"}>
                    {subscriber.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <ReactPaginate
          previousLabel={"Previous"}
          nextLabel={"Next"}
          breakLabel={"..."}
          pageCount={pageCount}
          marginPagesDisplayed={2}
          pageRangeDisplayed={5}
          onPageChange={handlePageClick}
          containerClassName={"flex items-center justify-center space-x-4 mt-4"}
          activeClassName={"text-white bg-blue-500 rounded-md"}
        />
      </CardContent>
    </Card>
  );
}
