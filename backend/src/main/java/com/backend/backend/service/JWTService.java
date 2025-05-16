package com.backend.backend.service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.SignatureAlgorithm;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

import javax.crypto.KeyGenerator;
import javax.crypto.SecretKey;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Service
public class JWTService {

    private static final Logger log = LoggerFactory.getLogger(JWTService.class);
    private final SecretKey secretKey;

    public JWTService() {
        try{
            SecretKey k = KeyGenerator.getInstance("HmacSHA256").generateKey();
            secretKey = Keys.hmacShaKeyFor(k.getEncoded());
        } catch (Exception e){
            throw new RuntimeException(e);
        }
    }

    public String getJWTToken(String username, String userId,Map<String, Object> claims) {
        claims.put("userId", userId);
        claims.put("username", username);
        return Jwts.builder()
                .claims(claims)
                .subject(username)
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis()+1000*60*15))
                .signWith(secretKey)
                .compact();
    }

    public String getUsername(String token){
        Claims data = getTokenData(token);
        if(data == null) return null;
        return data.getSubject();
    }

    public Object getFieldFromToken(String token, String key){
        Claims data = getTokenData(token);
        if(data == null) return null;
        return data.get(key);
    }

    public Claims getTokenData(String token) {
        try {
            return Jwts
                    .parser()
                    .verifyWith(secretKey).build()
                    .parseSignedClaims(token)
                    .getPayload();
                
        }catch (Exception e){
            return null;
        }
    }

    public String generateToken(String userId, String email) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("userId", userId);
        claims.put("email", email);

        return Jwts.builder()
                .setClaims(claims)
                .setSubject(email)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 10)) // 10 hours
                .signWith(SignatureAlgorithm.HS256, secretKey)
                .compact();
    }
    

}
