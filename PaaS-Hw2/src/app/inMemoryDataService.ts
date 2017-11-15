import { InMemoryDbService } from 'angular-in-memory-web-api';
export class InMemoryDataService implements InMemoryDbService {
    createDb() {
        const products = [
            {
                id: 0,
                productId: "0",
                pid: 1,
                category: "Meal",
                name: "便當",
                imageUrl: "https://storage.googleapis.com/paas-hw2-taipeitech.appspot.com/1-1_meal.jpg",
                score: 0,
                price: 0
            },
            {
                id: 1,
                productId: "1",
                pid: 2,
                category: "Drink",
                name: "星巴克",
                imageUrl: "https://storage.googleapis.com/paas-hw2-taipeitech.appspot.com/1-2_drink.jpg",
                score: 0,
                price: 0
            },
            {
                id: 2,
                productId: "2",
                pid: 3,
                category: "Fruit",
                name: "蘋果",
                imageUrl: "https://storage.googleapis.com/paas-hw2-taipeitech.appspot.com/1-3_fruit.jpg",
                score: 0,
                price: 0
            }
        ];

        const users = [
            {
                id: 0,
                userId: "0",
                cid: 1,
                sid: "106598043",
                name: "吳揚聲",
                phone: "0986417125",
                email: "yunsun60110@gmail.com",
                lineId: "",
                wechatId: "",
                role: "manager",
                visible: 1
            },
            {
                id: 1,
                userId: "1",
                cid: 2,
                sid: "106598016",
                phone: "0903585551",
                name: "王暐淇",
                email: "wayne12304@gmail.com",
                lineId: "",
                wechatId: "",
                role: "staff",
                visible: 1
            }
        ];
        return { products, users }
    }
}
