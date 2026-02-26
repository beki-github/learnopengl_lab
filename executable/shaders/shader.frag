#version 430 core
out vec4 FragColor;

struct Material{


   vec3 ambient;
   vec3 diffuse;
   vec3 specular;
   float shininess;


};


struct Light {


   vec3 direction;
   vec3 position;
   vec3 ambient;
   vec3 diffuse;
   vec3 specular;


};

layout (location= 6) uniform Light light;


in vec2 texCoord;
in vec3 Normal;
in vec3 fragPos;
in vec3 viewPos;

uniform sampler2D tex0;
uniform sampler2D tex1;


void main()
{  
   float outercone=0.90f;
   float innercone=0.95f;
   //calculating the theta for spotlight effect
   vec3 lightDir =normalize(fragPos-light.position);
   float theta=dot(lightDir,normalize(light.direction)); 
   float intent=clamp((theta-outercone)/(innercone-outercone),0.0f,1.0f);
 
   vec3 ambient=light.ambient*texture(tex0,texCoord).rgb;
   //calculation for diffuse lighting 
   vec3 norm = normalize(Normal);
   float diff= max(dot(norm,lightDir),0.0f);
   vec3 diffuse=light.diffuse*diff*texture(tex0,texCoord).rgb;

   //calculating the specular lighting 
   float specularStrength=0.5f;
   vec3 viewDir= normalize(viewPos-fragPos);
   vec3 reflectDir=reflect(-lightDir,norm);
   float spec= pow(max(dot(viewDir,reflectDir),0.0f),64);
   vec3 specular=light.specular*spec*texture(tex1,texCoord).rgb;
   // for point light 
   ambient;
   diffuse*=intent*2.5f;
   specular*=intent*2.5f;

   //calculating the final output
   vec3 result = ambient+diffuse+specular;
   FragColor =vec4(result,1.0);

  

}

