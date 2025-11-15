import {
  BanknotesIcon,
  ClockIcon,
  UserGroupIcon,
  InboxIcon,
} from '@heroicons/react/24/outline';
import { lusitana } from '@/app/ui/fonts';
import { fetchCardData } from '@/app/lib/data'; // Import the data fetching function



const iconMap = {
  collected: BanknotesIcon,
  customers: UserGroupIcon,
  pending: ClockIcon,
  invoices: InboxIcon,
};

/**
 * Wrapper component to fetch data and render the four Card components.
 * This is the component that was missing the export, causing the build error.
 * @returns Four statistical cards for the dashboard.
 */
export async function CardWrapper() {
  // Fetch data in parallel to optimize loading time
  const {
    numberOfInvoices,
    numberOfCustomers,
    totalPaidInvoices,
    totalPendingInvoices,
  } = await fetchCardData();

  return (
    <>
      <Card
        title="Collected"
        value={totalPaidInvoices}
        type="collected"
      />
      <Card
        title="Pending"
        value={totalPendingInvoices}
        type="pending"
      />
      <Card
        title="Total Invoices"
        value={numberOfInvoices}
        type="invoices"
      />
      <Card
        title="Total Customers"
        value={numberOfCustomers}
        type="customers"
      />
    </>
  );
}

/**
 * Renders a single statistic card.
 * @param title The title of the statistic.
 * @param value The value of the statistic (formatted currency or number).
 * @param type The type of card, used for icon mapping.
 */
export function Card({
  title,
  value,
  type,
}: {
  title: string;
  value: number | string;
  type: 'invoices' | 'customers' | 'pending' | 'collected';
}) {
  const Icon = iconMap[type];

  return (
    <div className="rounded-xl bg-gray-50 p-2 shadow-sm">
      <div className="flex p-4">
        {Icon ? <Icon className="h-5 w-5 text-gray-700" /> : null}
        <h3 className="ml-2 text-sm font-medium">{title}</h3>
      </div>
      <p
        className={`${lusitana.className}
          truncate rounded-xl bg-white px-4 py-8 text-center text-2xl`}
      >
        {value}
      </p>
    </div>
  );
}