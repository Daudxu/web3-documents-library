package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v4"
	_ "github.com/mattn/go-sqlite3"
)
type CustomerClaims struct {
	UserId         int    `json:"userId"`
	UserName       string `json:"userName"`
	RoleId         int    `json:"roleId"`
	StandardClaims jwt.StandardClaims
}
 
func (c CustomerClaims) Valid() error {
	return nil
}

func GenerateJwtToken(secret string, issuer string, audience string, expiredMinutes int64, userId int,  roleId int) (string, error) {
	hmacSampleSecret := []byte(secret) //密钥，不能泄露
	token := jwt.New(jwt.SigningMethodHS256)
	nowTime := time.Now().Unix()
	token.Claims = CustomerClaims{
		UserId:   userId,
		RoleId:   roleId,
		StandardClaims: jwt.StandardClaims{
			NotBefore: nowTime,                  // 签名生效时间
			ExpiresAt: nowTime + expiredMinutes, // 签名过期时间
			Issuer:    issuer,                   // 签名颁发者
			Audience:  audience,
		},
	}
	tokenString, err := token.SignedString(hmacSampleSecret)
	return tokenString, err
}

//解析token
func ParseJwtToken(tokenString string, secret string) (*CustomerClaims, error) {
	var hmacSampleSecret = []byte(secret)
	//前面例子生成的token
	token, err := jwt.ParseWithClaims(tokenString, &CustomerClaims{}, func(t *jwt.Token) (interface{}, error) {
		return hmacSampleSecret, nil
	})
	if err != nil {
		fmt.Println(err)
		return nil, err
	}
	claims := token.Claims.(*CustomerClaims)
	return claims, nil
}

type metadata struct {

	Name string 
	
	Url string
	
	Course []string
	
}
func main() {
	// db, err := sql.Open("sqlite3", "./database/nft.db")
	db, err := sql.Open("sqlite3", "./database/nft.db")
    checkErr(err)
	r := gin.Default()

	r.POST("/login", func(c *gin.Context) {
		rows, err := db.Query("SELECT id, name FROM admin")
		checkErr(err)
		// token, err := GenerateJwtToken(, user.Role, 3*24*time.Hour)
		// if err != nil {
		// 	log.Warn("name [%s] generateToken error: %v", u.User, err)
		// 	httputil.Error(rw, errors.ErrInternal)
		// 	return
		// }
		for rows.Next() {
			var id int
			var name string
			err = rows.Scan(&id, &name)
			checkErr(err)
			fmt.Println(id)
			fmt.Println(name)
		}
	
        
        c.JSON(http.StatusOK, rows)
        // c.JSON(http.StatusOK, gin.H{
		// 	"code": 200,
		// 	"message" : "done",
		// 	// "data": rows
		// })
	})

	r.GET("/", func(c *gin.Context) {
		c.String(http.StatusOK, "hello")
	})

	r.GET("/assets", func(c *gin.Context) {
		c.String(http.StatusOK, "get all assets!")
	})
	
	r.GET("/assets/:id", func(c *gin.Context) {
		// rows, err := db.Query("SELECT id, name FROM admin")
		checkErr(err)
		// c.String(http.StatusOK, json(rows))

	})
	
	r.POST("/assets", func(c *gin.Context) {
		filePtr, err := os.Create("info.json")
		checkErr(err)
		defer filePtr.Close()
		info := []metadata{{
			"Golang", "http://c.biancheng.net/golang/", 
			[]string{"http://c.biancheng.net/cplus/", "http://c.biancheng.net/linux_tutorial/"}}, {"Java", "http://c.biancheng.net/java/",
			[]string{"http://c.biancheng.net/socket/", "http://c.biancheng.net/python/"},
		}}
			
		encoder := json.NewEncoder(filePtr)
		err = encoder.Encode(info)
		checkErr(err)
		c.String(http.StatusOK, "POST assets!")
	})
	r.Run(":8000")
}

func checkErr(err error) {
    if err != nil {
        panic(err)
    }
}

