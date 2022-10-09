package controller

import (
	"net/http"
	. "server/model"

	"github.com/gin-gonic/gin"
)

func Assets(ctx *gin.Context) {
	ctx.JSON(200, CreateTopic(1,"test"))
}

func AssetsById(ctx *gin.Context) {
	ctx.JSON(200, CreateTopic(1,"test"))
}

func Prespectives(ctx *gin.Context) {
	ctx.JSON(200, CreateTopic(1,"test"))
}

func PrespectivesById(ctx *gin.Context) {
	ctx.JSON(200, CreateTopic(1,"test"))
}

func MustLogin() gin.HandlerFunc{
	return func (ctx *gin.Context)  {
		if _, status := ctx.GetQuery("token");!status {
            ctx.String(http.StatusUnauthorized, "缺少token参数")
			ctx.Abort()
		}else{
			ctx.Next()
		}
	}
}

func AddAssets(ctx *gin.Context) {
	ctx.JSON(200, CreateTopic(1,"test"))
}

func UpdateAssets(ctx *gin.Context) {
	ctx.JSON(200, CreateTopic(1,"test"))
}

func AddPrespectives(ctx *gin.Context) {
	ctx.JSON(200, CreateTopic(1,"test"))
}

func UpdatePrespectives(ctx *gin.Context) {
	ctx.JSON(200, CreateTopic(1,"test"))
}

