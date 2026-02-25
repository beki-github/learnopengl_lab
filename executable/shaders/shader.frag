// #version 430 core
// out vec4 FragColor;

// struct Material{


//    vec3 ambient;
//    vec3 diffuse;
//    vec3 specular;
//    float shininess;


// };


// struct Light {

//    float cons;
//    float linear;
//    float quadratic;

//    vec3 direction;
//    vec3 position;
//    vec3 ambient;
//    vec3 diffuse;
//    vec3 specular;


// };

// layout (location= 6) uniform Light light;


// in vec2 texCoord;
// in vec3 Normal;
// in vec3 fragPos;
// in vec3 viewPos;

// uniform sampler2D tex0;
// uniform sampler2D tex1;


// void main()
// {  
//    //calculating the theta for spotlight effect
//    vec3 lightDir =normalize(fragPos-light.position);
//    float theta=dot(lightDir,normalize(light.direction)); 
   

//    if (theta>cos(radians(12.5))){
//     vec3 ambient=light.ambient*texture(tex0,texCoord).rgb;
//    //calculation for diffuse lighting 
//    vec3 norm = normalize(Normal);
//    float diff= max(dot(norm,lightDir),0.0f);
//    vec3 diffuse=light.diffuse*diff*texture(tex0,texCoord).rgb;

//    //calculating the specular lighting 
//    float specularStrength=0.5f;
//    vec3 viewDir= normalize(viewPos-fragPos);
//    vec3 reflectDir=reflect(-lightDir,norm);
//    float spec= pow(max(dot(viewDir,reflectDir),0.0f),64);
//    vec3 specular=light.specular*spec*texture(tex1,texCoord).rgb;
//    // for point light 
//    float distance=length(light.position-fragPos);
//    float attunation=1.0/(light.cons + light.linear*(distance)+light.quadratic*(distance*distance));

//    ambient*=attunation;
//    diffuse*=attunation;
//    specular*=attunation;

//    //calculating the final output
//    vec3 result = ambient+diffuse+specular;
//    FragColor =vec4(result,1.0);
//    }


//    else{

//    vec3 ambient=light.ambient*texture(tex0,texCoord).rgb;
//    FragColor=vec4(ambient,1.0);

//    }
  

// }

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
   // 1. Calculate the angle for your one spotlight
   vec3 lightDir = normalize(fragPos - light.position);
   float theta = dot(lightDir, normalize(light.direction)); 
   
   // 2. Define the smooth edge boundaries for this light
   float cutOff = cos(radians(12.5));      // Core beam
   float outerCutOff = cos(radians(17.5)); // Where light hits total darkness
   float epsilon = cutOff - outerCutOff;
   float intensity = clamp((theta - outerCutOff) / epsilon, 0.0, 1.0);

   // 3. The if-else logic you requested
   if (theta > outerCutOff) // If we are anywhere inside the light cone
   {
       vec3 ambient = light.ambient * texture(tex0, texCoord).rgb;
       
       // Standard lighting math
       vec3 norm = normalize(Normal);
       vec3 fragToLight = normalize(light.position - fragPos); 
       float diff = max(dot(norm, fragToLight), 0.0f);
       vec3 diffuse = light.diffuse * diff * texture(tex0, texCoord).rgb;

       vec3 viewDir = normalize(viewPos - fragPos);
       vec3 reflectDir = reflect(-fragToLight, norm);
       float spec = pow(max(dot(viewDir, reflectDir), 0.0f), 64);
       vec3 specular = light.specular * spec * texture(tex1, texCoord).rgb;
       
       // Apply the smooth fading to this spotlight
       diffuse  *= intensity;
       specular *= intensity;

       // Apply distance attenuation
       float distance = length(light.position - fragPos);
       float attenuation = 1.0 / (light.cons + light.linear * distance + light.quadratic * (distance * distance));

       vec3 result = (ambient + diffuse + specular) * attenuation;
       FragColor = vec4(result, 1.0);
   }
   else // If we are completely outside the spotlight's reach
   {
       float distance = length(light.position - fragPos);
       float attenuation = 1.0 / (light.cons + light.linear * distance + light.quadratic * (distance * distance));
       vec3 ambient = light.ambient * texture(tex0, texCoord).rgb * attenuation;
       FragColor = vec4(ambient, 1.0);
   }
}