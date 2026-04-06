"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TooltipIcon } from "@/components/shared/TooltipIcon";
import type { SimplePriceInputs } from "@/types";
import { formatCount, formatUsd } from "@/utils/formatCurrency";
import {
  calculateBreakEven,
  calculateGrossBreakEvenPrice,
  getNetRetentionFraction,
  grossUpForNet,
} from "@/utils/simplePriceFinder";

export function SimpleInputForm({
  inputs,
  onChange,
}: {
  inputs: SimplePriceInputs;
  onChange: (p: Partial<SimplePriceInputs>) => void;
}) {
  const breakEvenCost = calculateBreakEven(inputs);
  const u = Math.max(1, inputs.targetUsers);
  const fixedPu = inputs.fixedCostsMonthly / u;
  const netFrac = getNetRetentionFraction(inputs);
  const grossBreakEven = calculateGrossBreakEvenPrice(inputs);

  return (
    <Card className="mx-auto max-w-2xl border-border">
      <CardHeader>
        <CardTitle>Maliyetlerini gir</CardTitle>
        <CardDescription>
          Maliyetler, mağaza / ödeme komisyonu ve vergi ile brüt liste fiyatı hesaplanır.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label className="mb-2 flex items-center gap-1">
            1. Aylık toplam sabit maliyetler
            <TooltipIcon content="Sunucu tabanı, maaşlar, ofis, yazılım lisansları, genel giderler — tek satırda toplam." />
          </Label>
          <Input
            type="number"
            className="font-mono text-xl"
            value={inputs.fixedCostsMonthly || ""}
            onChange={(e) => onChange({ fixedCostsMonthly: parseFloat(e.target.value) || 0 })}
          />
          <p className="mt-1 text-sm text-muted-foreground">
            {formatUsd(inputs.fixedCostsMonthly)} / ay
          </p>
        </div>

        <div>
          <Label className="mb-2 flex items-center gap-1">
            2. Kullanıcı başı değişken maliyet
            <TooltipIcon content="API, barındırma payı, destek — her yeni kullanıcı için marjinal maliyet." />
          </Label>
          <Input
            type="number"
            className="font-mono text-xl"
            value={inputs.variableCostPerUser || ""}
            onChange={(e) => onChange({ variableCostPerUser: parseFloat(e.target.value) || 0 })}
          />
          <p className="mt-1 text-sm text-muted-foreground">
            {formatUsd(inputs.variableCostPerUser)} / kullanıcı
          </p>
          <details className="mt-2">
            <summary className="cursor-pointer text-xs text-muted-foreground">
              Nasıl hesaplarım?
            </summary>
            <div className="mt-2 space-y-1 rounded-lg bg-muted p-3 text-xs text-muted-foreground">
              <p>• Örnek API: $10 / kullanıcı</p>
              <p>• Hosting payı: $20 / kullanıcı</p>
              <p>• Destek: $30 / kullanıcı</p>
              <p className="border-t border-border pt-1 font-semibold text-foreground">
                → Toplam: $60 / kullanıcı
              </p>
            </div>
          </details>
        </div>

        <div>
          <Label className="mb-2 flex items-center gap-1">
            3. Hedef kullanıcı sayısı (aylık)
            <TooltipIcon content="Bu dönem için planladığınız aktif veya ödemeli kullanıcı adedi." />
          </Label>
          <Input
            type="number"
            className="font-mono text-xl"
            min={1}
            value={inputs.targetUsers || ""}
            onChange={(e) =>
              onChange({ targetUsers: parseInt(e.target.value, 10) || 1 })
            }
          />
          <p className="mt-1 text-sm text-muted-foreground">
            {formatCount(inputs.targetUsers)} kullanıcı
          </p>
        </div>

        <div className="border-t border-border pt-6">
          <p className="mb-4 text-sm font-medium text-foreground">Kesintiler (%)</p>
          <div className="space-y-6">
            <div>
              <Label className="mb-2 flex items-center gap-1">
                4. App Store / mağaza komisyonu
                <TooltipIcon content="Apple veya Google IAP ücreti gibi. Liste fiyatı üzerinden yaklaşık yüzde olarak girin (ör. 15 veya 30)." />
              </Label>
              <Input
                type="number"
                className="font-mono text-xl"
                min={0}
                max={100}
                step={0.1}
                value={inputs.appStoreCommissionPercent}
                onChange={(e) =>
                  onChange({
                    appStoreCommissionPercent: Math.min(
                      100,
                      Math.max(0, parseFloat(e.target.value) || 0)
                    ),
                  })
                }
              />
              <p className="mt-1 text-sm text-muted-foreground">
                %{inputs.appStoreCommissionPercent.toLocaleString("en-US")}
              </p>
            </div>
            <div>
              <Label className="mb-2 flex items-center gap-1">
                5. Ödeme sağlayıcı komisyonu
                <TooltipIcon content="Web ödemelerinde Stripe vb. yaklaşık yüzde. IAP kullanıyorsanız çoğunlukla 0 bırakın." />
              </Label>
              <Input
                type="number"
                className="font-mono text-xl"
                min={0}
                max={100}
                step={0.1}
                value={inputs.paymentProviderCommissionPercent}
                onChange={(e) =>
                  onChange({
                    paymentProviderCommissionPercent: Math.min(
                      100,
                      Math.max(0, parseFloat(e.target.value) || 0)
                    ),
                  })
                }
              />
              <p className="mt-1 text-sm text-muted-foreground">
                %{inputs.paymentProviderCommissionPercent.toLocaleString("en-US")}
              </p>
            </div>
            <div>
              <Label className="mb-2 flex items-center gap-1">
                6. Vergi (etkin %)
                <TooltipIcon content="KDV veya satış vergisi için basitleştirilmiş model: liste fiyatına uygulanan etkin kesinti yüzdesi. İkili vergi / kur farkı için muhasebe danışmanlığı önerilir." />
              </Label>
              <Input
                type="number"
                className="font-mono text-xl"
                min={0}
                max={100}
                step={0.1}
                value={inputs.salesTaxPercent}
                onChange={(e) =>
                  onChange({
                    salesTaxPercent: Math.min(100, Math.max(0, parseFloat(e.target.value) || 0)),
                  })
                }
              />
              <p className="mt-1 text-sm text-muted-foreground">
                %{inputs.salesTaxPercent.toLocaleString("en-US")}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-primary/20 bg-primary/10 p-4">
          <p className="mb-2 text-sm text-muted-foreground">
            Başa baş — brüt liste fiyatı (aylık)
          </p>
          <p className="font-mono text-3xl font-bold text-foreground">
            {formatUsd(grossBreakEven)}
          </p>
          <p className="mt-2 text-xs text-muted-foreground">
            Kullanıcı başı maliyet: {formatUsd(breakEvenCost)} → nette karşılamak için{" "}
            {formatUsd(grossUpForNet(breakEvenCost, inputs), {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}{" "}
            brüt
          </p>
          <p className="text-xs text-muted-foreground">
            Net tahsilat oranı: {(netFrac * 100).toFixed(2)}% (kesintiler çarpımı)
          </p>
          <p className="mt-2 text-xs text-muted-foreground">
            Maliyet = ({formatUsd(inputs.fixedCostsMonthly)} ÷ {formatCount(u)}) +{" "}
            {formatUsd(inputs.variableCostPerUser)} ={" "}
            {formatUsd(fixedPu, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} +{" "}
            {formatUsd(inputs.variableCostPerUser)}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
