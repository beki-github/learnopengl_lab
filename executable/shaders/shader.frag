#version 430 core
out vec4 FragColor;

struct Material{
   vec3 ambient;
   vec3 diffuse;
   vec3 specular;
   float shininess;
};
struct Light {
   vec3 position;
   vec3 ambient;
   vec3 diffuse;
   vec3 specular;
};

layout (location = 6) uniform Material material;
layout (location= 10) uniform Light light;


in vec2 texCoord;
in vec3 Normal;
in vec3 fragPos;
in vec3 viewPos;

uniform sampler2D tex0;
uniform sampler2D tex1;


void main()
{  
   
  

   float ambident=0.2f;
   //calculation for diffuse lighting 
   vec3 lightDir =normalize(light.position-fragPos);
   vec3 norm = normalize(Normal);
   float diffuse= max(dot(norm,lightDir),0.0f);
   //calculating the specular lighting 
   float specularStrength=0.5f;
   vec3 viewDir= normalize(viewPos-fragPos);
   vec3 reflectDir=reflect(-lightDir,norm);
   float spec= pow(max(dot(viewDir,reflectDir),0.0f),16);
   float specular=specularStrength*spec;
   //calculating the final output
   
   vec4 result1= texture(tex0,texCoord)*vec4(light.diffuse,1.0f)*(diffuse+ambident)+texture(tex1,texCoord).r*specular;
   FragColor = result1;
}