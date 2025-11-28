import { Badge } from '../../ui/Badge';

export interface CreditTransaction {
  id: string | number;
  delta: number;
  reason: string;
  created_at: string;
  notes?: string | null;
}

export interface BillingInfo {
  plan: string | null;
  credits_balance: number;
  recent_transactions: CreditTransaction[];
}

interface BillingCreditsSectionProps {
  value: BillingInfo;
}

const reasonLabels: Record<string, string> = {
  manual_adjustment: 'Manual adjustment',
  job_created: 'Job created',
  stripe_payment: 'Stripe payment',
  refund: 'Refund',
  promo: 'Promo credit',
};

export function BillingCreditsSection({ value }: BillingCreditsSectionProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <h2 className="text-sm font-medium text-text-ink">Plan & credits</h2>
          <p className="text-xs text-text-subtle">
            Manage your subscription and see credits.
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-[minmax(0,1.2fr),minmax(0,1.8fr)]">
        <div className="rounded-xl border border-border-ghost bg-surface/60 p-3 text-xs md:p-4">
          <div className="flex items-center justify-between">
            <span className="font-medium text-text-ink">Current plan</span>
            <Badge variant="outline">
              {value.plan ?? 'No active plan'}
            </Badge>
          </div>
          <p className="mt-2 text-[11px] text-text-subtle">
            Billing is handled via Stripe.
          </p>
        </div>

        <div className="rounded-xl border border-border-ghost bg-surface/60 p-3 text-xs md:p-4">
          <div className="flex items-center justify-between">
            <span className="font-medium text-text-ink">Credits</span>
            <span className="text-sm font-semibold">
              {value.credits_balance} credits
            </span>
          </div>
          <p className="mt-1 text-[11px] text-text-subtle">
            Every render job adjusts your balance. Top-ups land here instantly after payment.
          </p>

          <div className="mt-3 border-t border-border-ghost pt-2">
            <div className="mb-2 text-[11px] font-medium text-text-subtle">
              Recent activity
            </div>
            <div className="space-y-1.5">
              {value.recent_transactions.map((tx) => (
                <div key={tx.id} className="flex items-start justify-between gap-2 text-[11px]">
                  <div className="flex flex-1 flex-col">
                    <span className="font-medium text-text-ink">
                      {reasonLabels[tx.reason] ?? tx.reason}
                    </span>
                    {tx.notes && (
                      <span className="text-text-subtle">{tx.notes}</span>
                    )}
                    <span className="text-[10px] text-text-subtle/80">
                      {new Date(tx.created_at).toLocaleString()}
                    </span>
                  </div>
                  <div
                    className={tx.delta >= 0 ? 'text-[11px] font-semibold text-green-600' : 'text-[11px] font-semibold text-red-600'}
                  >
                    {tx.delta > 0 ? '+' : ''}
                    {tx.delta}
                  </div>
                </div>
              ))}
              {value.recent_transactions.length === 0 && (
                <div className="text-[11px] text-text-subtle">
                  No recent credit activity yet.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

