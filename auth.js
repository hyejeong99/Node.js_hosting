var express = require('express');
var router = express.Router();

var template = require('./template.js');
var db = require('./db');
const { end } = require('./db');

var db2 = require('./db');

// 로그인 화면
router.get('/login', function (request, response) {
    var title = '관리자 로그인';
    var html = template.HTML(title,`
            <h2>관리자 로그인 페이지</h2>
            <form action="/auth/login_process" method="post">
            <p><input class="login" type="text" name="username" placeholder="관리자 아이디"></p>
            <p><input class="login" type="password" name="pwd" placeholder="관리자 비밀번호"></p>
            <p><input class="btn" type="submit" value="로그인"></p>
            </form>         
            <!-- p><a href="/auth/register">관리자 계정 추가</a></p --> 
        `, '');
    response.send(html);
});

// 로그인 프로세스
router.post('/login_process', function (request, response) {
    var username = request.body.username;
    var password = request.body.pwd;
    if (username && password) {             // id와 pw가 입력되었는지 확인
        
        db.query('SELECT * FROM usertable WHERE username = ? AND password = ?', [username, password], function(error, results, fields) {
            if (error) throw error;
            if (results.length > 0) {       // db에서의 반환값이 있으면 로그인 성공
                request.session.is_logined = true;      // 세션 정보 갱신
                request.session.nickname = username;
                request.session.save(function () {
                    response.redirect(`/`);
                });
            } else {              
                response.send(`<script type="text/javascript">alert("로그인 정보가 일치하지 않습니다."); 
                document.location.href="/auth/login";</script>`);    
            }            
        });

    } else {
        response.send(`<script type="text/javascript">alert("아이디와 비밀번호를 입력하세요."); 
        document.location.href="/auth/login";</script>`);    
    }
});

// 로그아웃
router.get('/logout', function (request, response) {
    request.session.destroy(function (err) {
        response.redirect('/');
    });
});

//데이터 조회
router.get('/search', function (request, response) {
    var title = '관리자 로그인';
    var html = template.HTML(title,`
            <h2>관리자 로그인 페이지</h2>
            <form action="/auth/login_process" method="post">
            <p><input class="login" type="text" name="username" placeholder="관리자 아이디"></p>
            <p><input class="login" type="password" name="pwd" placeholder="관리자 비밀번호"></p>
            <p><input class="btn" type="submit" value="로그인"></p>
            </form>         
            <!-- p><a href="/auth/register">관리자 계정 추가</a></p --> 
        `, '');
    response.send(html);
});

router.post('/search_process', function (request, response) {
    //로그인 됐으면 데이터 조회 값 받아오기
    db.query('SELECT * FROM infotable',function(error, results, fields){
        if (error) throw error;          
        if(results.length > 0){
            //데이터베이스에 있는 정보 넣어주기
            request.session.num=results[0].length;
            var plant = `<p>${results[0].plantId}<p/>`;
            request.session.plantId = plant;
            var time = `<p>${results[0].startT} ~ ${results[0].endT}<p/>`;
            request.session.totalTime = time;
            request.session.is_data = true;

            //테이블 형식으로 로봇 정보 넣어주기
            var tableTag = '<table>\n';
            for(let i=0;i<results.length;i++){
                tableTag += `<tr>
                        <td>${results[i].Rid}</td>
                        <td>　${results[i].period}　</td>
                        <td>　${results[i].area}　</td>
                    </tr>`;
            }
            tableTag += '</table>';
            request.session.searchData = tableTag;
            response.send(`<script type="text/javascript">alert("데이터 열람 성공했습니다.");
            document.location.href="/";</script>`);
        }else{
            response.send(`<script type="text/javascript">alert("데이터 열람 실패했습니다.");</script>`);    
        }
    });
});

// 회원가입 화면
router.get('/register', function(request, response) {
    var title = '관리자 추가';    
    var html = template.HTML(title, `
    <h2>관리자 추가</h2>
    <form action="/auth/register_process" method="post">
    <p><input class="login" type="text" name="username" placeholder="아이디"></p>
    <p><input class="login" type="password" name="pwd" placeholder="비밀번호"></p>    
    <p><input class="login" type="password" name="pwd2" placeholder="비밀번호 재확인"></p>
    <p><input class="btn" type="submit" value="제출"></p>
    </form>            
    <p><a href="/auth/login">로그인 화면으로 돌아가기</a></p>
    `, '');
    response.send(html);
});
 
// 회원가입 프로세스
router.post('/register_process', function(request, response) {    
    var username = request.body.username;
    var password = request.body.pwd;    
    var password2 = request.body.pwd2;

    if (username && password && password2) {
        
        db.query('SELECT * FROM usertable WHERE username = ?', [username], function(error, results, fields) { // DB에 같은 이름의 회원아이디가 있는지 확인
            if (error) throw error;
            if (results.length <= 0 && password == password2) {     // DB에 같은 이름의 회원아이디가 없고, 비밀번호가 올바르게 입력된 경우 
                db.query('INSERT INTO usertable (username, password) VALUES(?,?)', [username, password], function (error, data) {
                    if (error) throw error2;
                    response.send(`<script type="text/javascript">alert("관리자 추가가 완료되었습니다.");
                    document.location.href="/";</script>`);
                });
            } else if (password != password2) {                     // 비밀번호가 올바르게 입력되지 않은 경우
                response.send(`<script type="text/javascript">alert("입력된 비밀번호가 서로 다릅니다."); 
                document.location.href="/auth/register";</script>`);    
            }
            else {                                                  // DB에 같은 이름의 회원아이디가 있는 경우
                response.send(`<script type="text/javascript">alert("이미 존재하는 아이디 입니다."); 
                document.location.href="/auth/register";</script>`);    
            }            
        });

    } else {        // 입력되지 않은 정보가 있는 경우
        response.send(`<script type="text/javascript">alert("입력되지 않은 정보가 있습니다."); 
        document.location.href="/auth/register";</script>`);
    }
});

// //mysql 데이터 받아오기
// router.get('/', function(request, response) { 
//     db.query('SELECT * FROM infotable', function(error, results, fields) { // DB에 같은 이름의 회원아이디가 있는지 확인
//         if (error) throw error;
//         console.log(rows)
//     });
// });

module.exports = router;