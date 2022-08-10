package test

import "testing"

func TestMonster_Store(t *testing.T) {
	monster := &Monster{
		Name:  "红孩儿",
		Age:   10,
		Skill: "吐火",
	}
	res := monster.Store()
	if !res {
		t.Fatalf("monster.Store() 错误, 希望为=%v 实际为=%v", true, res)
	}
	t.Logf("monster.Store() 测试成功！")
}
