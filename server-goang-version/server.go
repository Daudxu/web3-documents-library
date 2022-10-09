package main

import (
	"server/controller"
	"server/service"

	"github.com/gin-gonic/gin"
)
var (
	jwtService service.JWTService = service.JWTAuthService()
	loginService service.LoginService = service.StaticLoginService()
	loginController controller.LoginController = controller.LoginHandler(loginService, jwtService)
)

func main() {
	r := gin.Default()
	r.Static("img", "./public/img")
	r.Static("images", "./public/images")
	r.Static("doc", "./public/doc")
	r.Static("metadata", "./public/metadata")

    r.LoadHTMLFiles("./public/index.html")

    r.GET("", func(c *gin.Context) {
        c.HTML(200, "index.html", nil)
    })

	// r.POST("/login", func(ctx *gin.Context) {
	// 	token := loginController.Login(ctx)
	// 	if token != "" {
	// 		ctx.JSON(http.StatusOK, gin.H{
	// 			"code" : 200,
	// 			"message": "success",
	// 			"token": token,
	// 		})
			
	// 	} else {
	// 		ctx.JSON(http.StatusUnauthorized, nil)
	// 	}
	// })
	// r.LoadHTMLGlob("public/*")
    // r.GET("", func(c *gin.Context) {
    //     c.HTML(http.StatusOK, "index.html", gin.H{
    //         "title": "Main website",
    //     })
    // })
	
	// v1 := r.Group("/v1")
	// {
		// v1.POST("/login", loginController.Login)
		// v1.POST("/login", loginController.Login)
		// v1.GET("/assets", Assets)
		// v1.GET("/assets/:id", AssetsById)
		// v1.GET("/prespectives", Prespectives)
		// v1.GET("/prespectives/:id", PrespectivesById)
		
		// v1.Use(MustLogin())
		// {
		// 	v1.POST("assets", AddAssets)
		// 	v1.PUT("assets", UpdateAssets)
		// 	v1.POST("prespectives", AddPrespectives)
		// 	v1.PUT("prespectives", UpdatePrespectives)
		// }

	// }

	r.Run(":8000") 
}