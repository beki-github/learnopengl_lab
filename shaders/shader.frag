#version 430 core
out vec4 FragColor;

struct Material{


   vec3 ambient;
   vec3 diffuse;
   vec3 specular;
   float shininess;


};


struct spotLight {

   vec3 position;
   vec3 direction;
   vec3 ambient;
   vec3 diffuse;
   vec3 specular;

};
struct pointLight{
   float constant;
   float linear;
   float quadratic;

   vec3 position;
   vec3 ambient;
   vec3 diffuse;
   vec3 specular;

};
layout (location= 6) uniform spotLight spotlight;
layout (location=11) uniform pointLight pointlight;


in vec2 texCoord;
in vec3 Normal;
in vec3 fragPos;
in vec3 viewPos;

uniform sampler2D tex0;
uniform sampler2D tex1;

vec3 calcSpotLight(){

   float outercone=0.97f;
   float innercone=0.999f;
   vec3 lightToFrag = normalize(fragPos - spotlight.position); // For the spotlight theta
    vec3 fragToLight = normalize(spotlight.position - fragPos);
   //calculating the theta for spotlight effect
   vec3 lightDir =normalize(fragPos-spotlight.position);
   float theta=dot(lightToFrag,normalize(spotlight.direction)); 
   float intent=clamp((theta-outercone)/(innercone-outercone),0.0f,1.0f);
 
   vec3 ambient=spotlight.ambient*texture(tex0,texCoord).rgb;
   //calculation for diffuse lighting 
   vec3 norm = normalize(Normal);
   float diff= max(dot(norm,fragToLight),0.0f);
   vec3 diffuse=spotlight.diffuse*diff*texture(tex0,texCoord).rgb;

   //calculating the specular lighting 
   float specularStrength=0.5f;
   vec3 viewDir= normalize(viewPos-fragPos);
   vec3 reflectDir=reflect(-lightDir,norm);
   float spec= pow(max(dot(viewDir,reflectDir),0.0f),64);
   vec3 specular=spotlight.specular*spec*texture(tex1,texCoord).rgb;
   // for point light 
   ambient;
   diffuse*=intent*2.5f;
   specular*=intent*2.5f;

   //calculating the final output
   vec3 result = ambient+diffuse+specular;

   return result;


}

vec3 calcPointLight(){

   vec3 fragToLight = normalize(pointlight.position - fragPos);
   //calculating the theta for spotlight effect
   vec3 lightDir =normalize(fragPos-pointlight.position);
 
   vec3 ambient=pointlight.ambient*texture(tex0,texCoord).rgb;
   //calculation for diffuse lighting 
   vec3 norm = normalize(Normal);
   float diff= max(dot(norm,fragToLight),0.0f);
   vec3 diffuse=pointlight.diffuse*diff*texture(tex0,texCoord).rgb;

   //calculating the specular lighting 
   float specularStrength=0.5f;
   vec3 viewDir= normalize(viewPos-fragPos);
   vec3 reflectDir=reflect(-lightDir,norm);
   float spec= pow(max(dot(viewDir,reflectDir),0.0f),64);
   vec3 specular=pointlight.specular*spec*texture(tex1,texCoord).rgb;
   // attuntation for point light 
    float distance    = length(pointlight.position - fragPos);
    float attenuation = 1.0 / (pointlight.constant + pointlight.linear * distance + 
  			     pointlight.quadratic * (distance * distance)); 
   ambient*=attenuation;
   diffuse*=attenuation;
   specular*=attenuation;

   //calculating the final output
   vec3 result = ambient+diffuse+specular;

   return result;

}

void main()
{  
   
   vec3 result = calcSpotLight();
   FragColor =vec4(result,1.0);

  

}

