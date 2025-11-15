import Table from '@/app/ui/customers/table';
import { Metadata } from 'next';
import { fetchFilteredCustomers } from '@/app/lib/data';

// Define the interface for clarity and better TypeScript resolution in the build environment
interface SearchParams {
    query?: string;
    page?: string;
}

export const metadata: Metadata = {
    title: 'Customers',
};

// Apply the interface to the component's argument
export default async function Page({
    searchParams,
}: {
    searchParams?: SearchParams; // Using the defined interface
}) {
    const query = searchParams?.query || '';
    const currentPage = Number(searchParams?.page) || 1;

    const customers = await fetchFilteredCustomers(query);

    return (
        <div className="w-full">
            <Table query={query} currentPage={currentPage} customers={customers} />
        </div>
    );
}