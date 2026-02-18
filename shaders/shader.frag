#version 430 core
out vec4 FragColor;


in vec3 objColor;
in vec2 texCoord;
in vec3 Normal;
in vec3 fragPos;
in vec3 lightSourcePos;
uniform sampler2D tex0;


void main()
{  
   float ambidentStrength=0.2f;
   vec3 ambident=ambidentStrength*objColor;
   //calculation for diffuse lighting 
   vec3 lightDir =normalize(lightSourcePos-fragPos);
   vec3 norm = normalize(Normal);
   float diff= max(dot(norm,lightDir),0.0f);
   vec3 diffuse=diff*objColor;
   vec4 texColor=texture(tex0,texCoord);
   vec4 result= vec4(diffuse+ambident,1.0f)*texColor;
   
   FragColor = result;
}