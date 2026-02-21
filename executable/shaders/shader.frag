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
   
   vec3 diffuseTex = vec3(texture(tex0, texCoord));
   vec3 specularTex = vec3(texture(tex1, texCoord).r);


   vec3 ambident=light.ambient*diffuseTex;
   //calculation for diffuse lighting 
   vec3 lightDir =normalize(light.position-fragPos);
   vec3 norm = normalize(Normal);
   float diff= max(dot(norm,lightDir),0.0f);
   vec3 diffuse=(diff*diffuseTex)*light.diffuse;
   //calculating the specular lighting 
   float specularStrength=1.0f;
   vec3 viewDir= normalize(viewPos-fragPos);
   vec3 reflectDir=reflect(-lightDir,norm);
   float spec= pow(max(dot(viewDir,reflectDir),0.0f),4);
   vec3 specular=specularStrength*(spec*specularTex)*light.specular;
   //calculating the final output
   
   vec4 result= vec4(specular+diffuse+ambident,1.0f);

   FragColor = result;
}