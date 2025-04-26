import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Gift, Clock, ArrowRight } from 'lucide-react'

const promotions = [
  {
    title: "Ưu đãi mở thẻ tín dụng",
    description: "Nhận hoàn tiền 5% cho các giao dịch trong 3 tháng đầu tiên",
    expiry: "30/06/2023",
    type: "Thẻ tín dụng",
  },
  {
    title: "Tiết kiệm online",
    description: "Lãi suất ưu đãi lên đến 7.2%/năm cho kỳ hạn 12 tháng",
    expiry: "15/07/2023",
    type: "Tiết kiệm",
  },
  {
    title: "Vay ưu đãi",
    description: "Lãi suất chỉ từ 5.99%/năm cho khoản vay cá nhân",
    expiry: "31/07/2023",
    type: "Vay",
  },
]

export function PromotionalProgramsComponents() {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl font-bold flex items-center">
          <Gift className="mr-2 h-6 w-6 text-primary" />
          Chương trình khuyến mại
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {promotions.map((promo, index) => (
            <Card key={index} className="flex flex-col justify-between">
              <CardContent className="pt-6">
                <Badge className="mb-2">{promo.type}</Badge>
                <h3 className="text-lg font-semibold mb-2">{promo.title}</h3>
                <p className="text-sm text-muted-foreground mb-4">{promo.description}</p>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Clock className="mr-1 h-4 w-4" />
                  Hết hạn: {promo.expiry}
                </div>
              </CardContent>
              <CardContent className="pt-0">
                <Button className="w-full" variant="outline">
                  Tìm hiểu thêm
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

