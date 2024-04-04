import ReactGA from 'react-ga';

const { wcs,wcs_do,kakaoPixel, fbq } = window
module.exports = {
    userSignUp ( data ) {
        // console.log( "Analytics :  userSignUp", data)
        const Analytics = async(data) => {
            await ReactGA.event({
                category: 'User',
                action: '회원가입완료'
            })
            /** naver Ad */
            var _nao={}
            _nao["cnv"] = wcs.cnv("2", "1")
            await wcs_do(_nao);
            /** /naver Ad */
            /** KakaoPixel */
            await kakaoPixel('4308069873502305339').completeRegistration();
            /** /KakaoPixel */
            /** Facebook Pixel */
            await fbq('track', 'CompleteRegistration');
            /** /Facebook Pixel */

            return true
        }
        return Analytics(data).then(res => {
            return res
        })
    },

    userLogin ( data ) {
        // console.log( "Analytics :  userLogin", data)
    },

    userPayment ( data ) {
        // console.log( "Analytics :  payment", data )
        const Analytics = async(data) => {
            /** Ga */
            await ReactGA.plugin.require('ecommerce')
            await ReactGA.plugin.execute('ecommerce', 'addItem', {
                id: data.id,
                name: data.name,
                sku: data.sku,
                price: data.price,
                category: data.category,
                quantity: data.quantity
            })
            await ReactGA.plugin.execute('ecommerce', 'addTransaction', {
                id: data.id,
                revenue: data.revenue,
            })
            await ReactGA.plugin.execute('ecommerce', 'send')
            await ReactGA.plugin.execute('ecommerce', 'clear')
            /** /Ga */

            /** naver Ad */
            var _nao={}
            const { wcs,wcs_do } = window
            _nao["cnv"] = wcs.cnv("1", data.revenue )
            await wcs_do(_nao);
            /** /naver Ad */

            /** KakaoPixel */
            await kakaoPixel('4308069873502305339').pageView();
            await kakaoPixel('4308069873502305339').purchase({
                total_quantity: "1", // 주문 내 상품 개수(optional)
                total_price: data.revenue,  // 주문 총 가격(optional)
                currency: "KRW",     // 주문 가격의 화폐 단위(optional, 기본 값은 KRW)
                products: [          // 주문 내 상품 정보(optional)
                    { name: data.name, quantity: "1", price: data.price}
                ]
            });
            /** /KakaoPixel */
            /** Facebook Pixel */
            await fbq('track', 'Purchase', {value:  data.revenue, currency: 'KRW'});
            /** /Facebook Pixel */
            return true
        }
        return Analytics(data).then(res => {
            return res
        })
    },
    userSubscribe ( data ) {
        // console.log( "Analytics :  Subscribe" )
        // console.log( data )

        const Analytics = async(data) => {
            console.log( 'data', data )

            /** Ga */
            await ReactGA.plugin.require('ecommerce')
            await ReactGA.plugin.execute('ecommerce', 'addItem', {
                id: data.id,
                name: data.name,
                sku: data.sku,
                price: data.price,
                category: 1,
                quantity: '1'
            })
            await ReactGA.plugin.execute('ecommerce', 'addTransaction', {
                id: data.id,
                revenue: data.revenue,
            })
            await ReactGA.plugin.execute('ecommerce', 'send')
            await ReactGA.plugin.execute('ecommerce', 'clear')
            /** /Ga */
            /** naver Ad */
            var _nao={}
            const { wcs,wcs_do } = window
            _nao["cnv"] = wcs.cnv("1", data.revenue )
            await wcs_do(_nao);
            /** /naver Ad */
            /** KakaoPixel */
            await kakaoPixel('4308069873502305339').pageView();
            await kakaoPixel('4308069873502305339').purchase({
                total_quantity: "1", // 주문 내 상품 개수(optional)
                total_price: data.revenue,  // 주문 총 가격(optional)
                currency: "KRW",     // 주문 가격의 화폐 단위(optional, 기본 값은 KRW)
                products: [          // 주문 내 상품 정보(optional)
                    { name: data.name, quantity: "1", price: data.price}
                ]
            });
            /** /KakaoPixel */
            /** Facebook Pixel */
            await fbq('track', 'Subscribe', {value:  data.revenue, currency: 'KRW'});
            /** /Facebook Pixel */
            return true
        }
        return Analytics(data).then(res => {
            return res
        })
    },


}

