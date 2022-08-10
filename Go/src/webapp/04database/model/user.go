package model

import (
	"fmt"
	util "webapp/04database/mysql"
)

type Server struct {
	ServerID   int    `json:"server_id"`
	ServerName string `json:"server_name"`
	IP         string `json:"ip"`
	Port       int    `json:"port"`
	ManifestID int    `json:"manifest_id"`
}

func (s *Server) AddServer() error {
	sqlStr := "insert into server_list(server_id,server_name,ip,port,manifest_id) values(?,?,?,?,?)"
	stmt, err := util.Db.Prepare(sqlStr)
	if err != nil {
		fmt.Println("预编译出现错误：", err)
		return err
	}
	_, erro := stmt.Exec(s.ServerID, s.ServerName, s.IP, s.Port, s.ManifestID)
	if erro != nil {
		fmt.Println("执行出现异常：", erro)
	}
	return nil
}
