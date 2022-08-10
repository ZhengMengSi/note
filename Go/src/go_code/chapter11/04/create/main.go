package main

type Goods struct {
	Name  string
	Price float64
}

type Brand struct {
	Name    string
	Address string
}

type TV struct {
	Goods
	Brand
}

type TV2 struct {
	*Goods
	*Brand
}

func main() {
	tv := TV{
		Goods{"电视机001", 63.3},
		Brand{"海尔", "山东"},
	}

	tv2 := TV{
		Goods{
			Price: 5000.33,
			Name:  "电视002",
		},
		Brand{
			Address: "北京",
			Name:    "格力",
		},
	}

}
