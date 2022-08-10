package model

import "fmt"

type account struct {
	accountNo string
	pwd       string
	balance   float64
}

func NewAccount(accountNo string, pwd string, balance float64) *account {
	if len(accountNo) < 6 || len(accountNo) > 10 {
		fmt.Println("账号长度不对")
		return nil
	}
	if len(pwd) != 6 {
		fmt.Println("密码长度不对")
		return nil
	}
	if balance < 20 {
		fmt.Println("余额数目不对")
		return nil
	}

	return &account{
		accountNo: accountNo,
		pwd:       pwd,
		balance:   balance,
	}
}

// 方法
// 1.存款
func (account *account) Deposite(money float64, pwd string) {
	if pwd != account.pwd {
		fmt.Println("你输入的密码不正确")
		return
	}
	if money < 0 {
		fmt.Println("你输入的金额不对")
		return
	}
	account.balance += money
	fmt.Println("存款成功")
}

// 2.取款
func (account *account) WithDraw(money float64, pwd string) {
	if pwd != account.pwd {
		fmt.Println("你输入的密码不正确")
		return
	}
	if money < 0 || money > account.balance {
		fmt.Println("你输入的金额不对")
		return
	}
	account.balance -= money
	fmt.Println("取款成功")
}

// 3.查询余额
func (account *account) Query(pwd string) {
	if pwd != account.pwd {
		fmt.Println("你输入的密码不正确")
		return
	}
	fmt.Println("account=", account.accountNo, " balance=", account.balance)
}
