#version 430 core
out vec4 FragColor;

struct Material{
   vec3 ambient;
   vec3 diffuse;
   vec3 specular;
   float shininess;
};
struct Light {

   float cons;
   float linear;
   float quadratic;

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
   
  

   vec3 ambient=light.ambient*texture(tex0,texCoord).rgb;
   //calculation for diffuse lighting 
   vec3 lightDir =normalize(light.position-fragPos);
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
   float distance=length(light.position-fragPos);
   float attunation=1.0/(light.cons + light.linear*(distance)+light.quadratic*(distance*distance));




   ambient*=attunation;
   diffuse*=attunation;
   specular*=attunation;


   //calculating the final output
   vec3 result = ambient+diffuse+specular;
   FragColor =vec4(result,1.0);
   
}